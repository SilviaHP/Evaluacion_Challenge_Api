import { APIGatewayProxyHandler } from "aws-lambda";
import { persistenceAdapter } from "../adapters/persistenceAdapter";
import { userSchema } from "../schemas/userSchema";
import { IPersistencePort } from "../core/ports";
import { HttpException } from "../utils/httpException";
import { IUser } from "../entities/user";

export const handler: APIGatewayProxyHandler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);

    const { error } = userSchema.validate(body);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `${error.details.map((x) => x.message).join(", ")}`,
        }),
      };
    }

    const persistence: IPersistencePort = persistenceAdapter();
    await persistence.saveUser(body as IUser);
    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Usuario registrado con éxito." }),
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
      body: JSON.stringify({ error: "Error al registrar el usuario." }),
    };
  }
};
