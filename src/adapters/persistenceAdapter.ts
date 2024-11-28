import { ScanCommand, DynamoDBClient,  PutItemCommand } from "@aws-sdk/client-dynamodb";
import { IPersistencePort } from "../core/ports";
import { IHistoryCharacter } from "../entities/character";
import { HttpException } from "../utils/httpException";
import { IUser } from "../entities/user";


const client = new DynamoDBClient({ region: "us-east-1" });
export const persistenceAdapter = (): IPersistencePort => ({

  saveHistoryCharacter: async (
    historyData: IHistoryCharacter
  ): Promise<IHistoryCharacter> => {
    
     const params = {
      TableName: (process.env.HISTORY_TABLE || 'HistoryCharacter'),
      Item: {
        id: { S: historyData.id },
        characterName: { S: historyData.characterName },
        planetName: { S: historyData.planetName },
        planetImageUrl: { S: historyData.planetImageUrl },
        timestamp: { N: historyData.timestamp.toString() },
      },
    };

    try {
      const command = new PutItemCommand(params);
      await client.send(command);
      return historyData;

    } catch (error) {
      throw new HttpException(
        `No se pudo registrar la informacion historica de la consultas por personaje. ${error}`, 500);
    }
  },

  
  getHistoryCharacter: async (
    limit: number,
    lastEvaluatedKey?: { timestamp: { N: string }, id: { S: string } }
  ): Promise<{ items: IHistoryCharacter[], lastEvaluatedKey?: { timestamp: { N: string }, id: { S: string } } }> => {
    const params: any = {
      TableName: (process.env.HISTORY_TABLE || 'HistoryCharacter'),
      Limit: limit,
    };

    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }

    try {
      const command = new ScanCommand(params);
      const response = await client.send(command);

      const items = response.Items.map(item => ({
        id: item.id.S,
        characterName: item.characterName.S,
        planetName: item.planetName.S,
        planetImageUrl: item.planetImageUrl.S,
        timestamp: parseInt(item.timestamp.N, 10),
      })) || [];

    const newLastEvaluatedKey = response.LastEvaluatedKey ? 
      { timestamp: { N: response.LastEvaluatedKey.timestamp.N }, id: { S: response.LastEvaluatedKey.id.S} } : undefined;

    return {
      items,
      lastEvaluatedKey: newLastEvaluatedKey,
    };
  } catch (error) {
    throw new HttpException(`No se pudo obtener el historial de consultas. ${error}`, 500);
  }
},


  saveUser: async (user: IUser): Promise<void> => {

    user.timestamp = Date.now();
    const params = {
      TableName: (process.env.USER_TABLE || 'User'),
      Item: {
        email: { S: user.email },
        name: { S: user.name },
        paternalSurname: { S: user.paternalSurname },
        maternalSurname: { S: user.maternalSurname },
        dateBirth: { S: user.dateBirth },
        timestamp: { N: user.timestamp.toString() }
      },
    };

    try {
      const command = new PutItemCommand(params);
      await client.send(command);
    } catch (error) {

      throw new HttpException(
        `No se pudo registrar la informacion del usuario. ${error}`, 500);
    }
  },
});
