import { ICharacter , IHistoryCharacter } from "../entities/character";
import { IPlanet, IImagePlanet } from "../entities/planet";
import { IUser } from "../entities/user";

export interface IExternalServicePort {
  fetchCharacterByName(characterName: string): Promise<ICharacter>;

  fetchPlanetByUrl(urlPlanet: string): Promise<IPlanet>;

  fetchImagePlanet(planetName: string): Promise<IImagePlanet>;
}


export interface IPersistencePort {
  saveHistoryCharacter(historyData : IHistoryCharacter): Promise<IHistoryCharacter>;

  getHistoryCharacter (
    limit: number,
    lastEvaluatedKey?: { timestamp: { N: string }, id: { S: string } }
    ): Promise<{ items: IHistoryCharacter[], lastEvaluatedKey?: { timestamp: { N: string }, id: { S: string } } }>;

  saveUser(user: IUser): Promise<void>;
}
