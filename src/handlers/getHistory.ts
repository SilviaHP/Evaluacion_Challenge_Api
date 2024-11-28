import { APIGatewayProxyHandler } from "aws-lambda";
import { persistenceAdapter } from "../adapters/persistenceAdapter";
import { fetchHistoryCharacterUseCase } from "../core/useCases";
import { HttpException } from "../utils/httpException";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    
    const limit = parseInt(event.queryStringParameters?.limit || '10');
    const lastEvaluatedKey = event.queryStringParameters?.lastEvaluatedKey
      ? JSON.parse(event.queryStringParameters.lastEvaluatedKey)
      : undefined;

    const persistence = persistenceAdapter();
    const { items, lastEvaluatedKey: newLastEvaluatedKey } = await fetchHistoryCharacterUseCase(persistence, limit, lastEvaluatedKey);

    return {
      statusCode: 200,
      body: JSON.stringify({ items, lastEvaluatedKey: newLastEvaluatedKey }),
    };
  } catch (error) {
    if (error instanceof HttpException) {
      return {
        statusCode: error.status,
        body: JSON.stringify({ message: error.message }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error al obtener la información de las consultas historicas de los personajes." }),
    };
  }
};