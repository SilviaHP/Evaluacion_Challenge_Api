import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import axios from "axios";
import { ICharacter } from "../entities/character";
import { IPlanet, IImagePlanet } from "../entities/planet";
import { IExternalServicePort } from "../core/ports";
import { HttpException } from "../utils/httpException";

const client = new DynamoDBClient({ region: "us-east-1" });
const CACHE_TABLE = process.env.CACHE_TABLE || "CacheCharacter";
const CACHE_TTL = parseInt(process.env.TTL_MINUTES || "30") * 60;

const getCacheKey = (type: string, key: string) => `${type}:${key}`;

const getFromCache = async (cacheKey: string) => {
  try {
      const params = {
        TableName: CACHE_TABLE,
        Key: { cacheKey: { S: cacheKey } },
      };
      const result = await client.send(new GetItemCommand(params));

      if (result.Item) {
        return result.Item.data.S ? JSON.parse(result.Item.data.S) : null;
      } else {
        //No se encontro en tabla cache
        return null;
      }
  } 

     catch (error) {
      return null;
  }
};

const saveToCache = async (cacheKey: string, data: any) => {
  try{
    const ttl = Math.floor(Date.now() / 1000) + CACHE_TTL;
    const params = {
      TableName: CACHE_TABLE,
      Item: {
        cacheKey: { S: cacheKey },
        data: { S: JSON.stringify(data) },
        ttl: { N: ttl.toString() },
      },
    };

    const saveTo= await client.send(new PutItemCommand(params));
 } 
  catch (error) {
    throw new HttpException(`No se pudo registrar en la tabla de cache. ${error} `, 500);
  }
};

export const externalServiceAdapter = (): IExternalServicePort => ({
  
  fetchCharacterByName: async (characterName: string): Promise<ICharacter> => {
  
    const cacheKey = getCacheKey("character", characterName);
    const cachedData = await getFromCache(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await axios.get(`https://swapi.py4e.com/api/people`, {
      params: { search: characterName },
    });


    if (response.status !== 200) {
      throw new HttpException(
        "No se pudo obtener el personaje en Swapi",
        response.status
      );
    }

    //Si hay resultados, solo considero la primera coincidencia
    const data = response.data;
    if (!data || data.results.length === 0) {
      throw new HttpException("El personaje no fue encontrado en Swapi.", 404);
    }

    const character = {
      characterName: data.results[0].name,
      homeworld: data.results[0].homeworld,
    };

    await saveToCache(cacheKey, character);
    return character;
  },



  fetchPlanetByUrl: async (urlPlanet: string): Promise<IPlanet> => {
    const cacheKey = getCacheKey("planet", urlPlanet);
    const cachedData = await getFromCache(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await axios.get(urlPlanet);
    if (response.status !== 200) {
      throw new HttpException(
        "No se pudo obtener el planeta en Swapi",
        response.status
      );
    }
    const data = response.data;

    if (!data) {
      throw new HttpException("El planeta no fue encontrado en Swapi", 404);
    }

    const planet = {
      planetName: data.name,
      climate: data.climate,
    };

    await saveToCache(cacheKey, planet);
    return planet;
  },



  fetchImagePlanet: async (planetName: string): Promise<IImagePlanet> => {
    try {
      const cacheKey = getCacheKey("image", planetName);
      const cachedData = await getFromCache(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const idAuthorization = process.env.ID_CLIENT_UNSPLASH;
      const response = await axios.get(
        `https://api.unsplash.com/search/photos`,
        {
          params: { query: planetName, per_page: 1 },
          headers: { Authorization: idAuthorization },
        }
      );

      const data = response.data;
      //Si no hay resultados, retorna un objeto vacio. Sino solo considero la 1ra. coincidencia
      const image = {
        idPlanet: data.results.length === 0 ? "" : data.results[0].id,
        planetImageUrl:
          data.results.length === 0 ? "" : data.results[0].urls.small,
      };

      await saveToCache(cacheKey, image);
      return image;

    } catch (error) {
      throw new HttpException(
        `No se pudo obtener la imagen del planeta en Unsplash. ${error}`,
        500
      );
    }
  },
});
