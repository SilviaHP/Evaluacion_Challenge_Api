import { APIGatewayProxyHandler } from "aws-lambda";
import { externalServiceAdapter } from "../adapters/externalServiceAdapter";
import { persistenceAdapter } from "../adapters/persistenceAdapter";
import { fetchPlanetUseCase } from "../core/useCases";
import { paramCharacterSchema } from "../schemas/characterSchema";
import { HttpException } from "../utils/httpException";
import { cleanErrorMessage } from "../utils/response";

export const handler: APIGatewayProxyHandler = async (event: any) => {
  try {
    const nameParam = event.queryStringParameters?.characterName;
    if (!nameParam) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "El parametro characterName es requerido.",
        }),
      };
    }

    const { error } = paramCharacterSchema.validate({
      characterName: nameParam,
    });
    if (error) {
      return {
        statusCode: 400,
        body: cleanErrorMessage(
          JSON.stringify({
            message: `${error.details.map((x) => x.message).join(", ")} `,
          })
        ),
      };
    }

    const externalService = externalServiceAdapter();
    const persistenceService = persistenceAdapter();
    const historyCharacter = await fetchPlanetUseCase(
      externalService,
      persistenceService,
      nameParam
    );
    return {
      statusCode: 200,
      body: JSON.stringify(historyCharacter),
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
      body: JSON.stringify({
        message: "No pudo recuperarse/procesarse la información.",
      }),
    };
  }
};
