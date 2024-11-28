import { v4 as uuidv4 } from "uuid";
import { IExternalServicePort, IPersistencePort } from "../core/ports";
import { IUser } from "../entities/user";
import { IHistoryCharacter } from '../entities/character';


// para consultar en Swapi,Unsplash y registrar con base de datos local
export const fetchPlanetUseCase = async (
  externalService: IExternalServicePort,
  persistenceService: IPersistencePort,
  characterName: string
): Promise<IHistoryCharacter> => {

  const characterData = await externalService.fetchCharacterByName( characterName );
  const planetData = await externalService.fetchPlanetByUrl( characterData.homeworld );
  const imagePlanetData = await externalService.fetchImagePlanet( planetData.planetName );
  
  const historyData : IHistoryCharacter = {
    id : uuidv4(),
    characterName: characterData.characterName,
    planetName: planetData.planetName,
    planetImageUrl: imagePlanetData.planetImageUrl,
    timestamp: Date.now()
  }
  return await persistenceService.saveHistoryCharacter( historyData );
};


// para consultar el historial de personajes ( data combinada de Swapi y Unsplash)
export const fetchHistoryCharacterUseCase = async (
  persistence: IPersistencePort,
  limit: number,
  lastEvaluatedKey?: { timestamp: { N: string }, id: { S: string } }
): Promise<{ items: IHistoryCharacter[], lastEvaluatedKey?: { timestamp: { N: string }, id: { S: string } } }> => {
  return await persistence.getHistoryCharacter(limit, lastEvaluatedKey);
};


// para registrar con base de datos local
export const saveUserUseCase = async (
  persistence: IPersistencePort,
  user: IUser
) => {  
  await persistence.saveUser(user);
};
