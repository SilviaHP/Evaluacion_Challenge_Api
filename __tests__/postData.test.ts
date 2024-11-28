import { handler } from '../src/handlers/postData';
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';


describe('PostData Handler', () => {
  const context: Context = {} as any;

  it('debería registrar un usuario con éxito; o actualizarlo si se envia el mismo email (pk)', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({
        email: "user5@gmail.com",
        name: "Ana",
        paternalSurname: "Perez",
        maternalSurname: "Diaz",
        dateBirth: "1980-01-30"
      }),
    } as any;

    const result = await handler(event, context, () => null) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body).message).toBe("Usuario registrado con éxito.");
  });

  it('debería devolver un error 400 para un email no válido', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({
        email: "xxxxx",
        name: "Ana",
        paternalSurname: "Perez",
        maternalSurname: "Diaz",
        dateBirth: "1980-01-30"
      }),
    } as any;

    const result = await handler(event, context, () => null) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe("El email debe ser un correo electrónico válido.");
  });

  it('debería devolver un error 400 cuando falta el email', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({
        email: "",
        name: "Ana",
        paternalSurname: "Perez",
        maternalSurname: "Diaz",
        dateBirth: "1980-01-30"
      }),
    } as any;

    const result = await handler(event, context, () => null) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe("El email es un campo obligatorio.");
  });

  it('debería devolver un error 400 cuando falta el nombre', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({
        email: "user01@gmail.com",
        name: "",
        paternalSurname: "Perez",
        maternalSurname: "Diaz",
        dateBirth: "1980-01-30"
      }),
    } as any;

    const result = await handler(event, context, () => null) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe("El nombre es un campo obligatorio.");
  });

  it('debería devolver un error 400 cuando el nombre tiene caracteres especiales', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({
        email: "user01@gmail.com",
        name: "/*dd0323",
        paternalSurname: "Perez",
        maternalSurname: "Diaz",
        dateBirth: "1980-01-30"
      }),
    } as any;

    const result = await handler(event, context, () => null) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe("El nombre debe ser un texto con caracteres válidos.");
  });

  it('debería devolver un error 400 cuando falta el apellido paterno', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({
        email: "user01@gmail.com",
        name: "Patricia",
        paternalSurname: "",
        maternalSurname: "Diaz",
        dateBirth: "1980-01-30"
      }),
    } as any;

    const result = await handler(event, context, () => null) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe("El apellido paterno es un campo obligatorio.");
  });

  it('debería devolver un error 400 cuando el apellido paterno tiene caracteres especiales', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({
        email: "user01@gmail.com",
        name: "Patricia",
        paternalSurname: "/*dd0323",
        maternalSurname: "Diaz",
        dateBirth: "1980-01-30"
      }),
    } as any;

    const result = await handler(event, context, () => null) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe("El apellido paterno debe ser un texto con caracteres válidos.");
  });


  it('debería devolver un error 400 cuando el apellido materno tiene caracteres especiales', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({
        email: "user01@gmail.com",
        name: "Patricia",
        paternalSurname: "Diaz",
        maternalSurname: "/*dd0323",
        dateBirth: "1980-01-30"
      }),
    } as any;

    const result = await handler(event, context, () => null) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe("El apellido materno debe ser un texto con caracteres válidos.");
  });

  it('debería devolver un error 400 cuando la fecha de nacimiento no está en el formato correcto', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({
        email: "user01@gmail.com",
        name: "Patricia",
        paternalSurname: "Diaz",
        maternalSurname: "Lopez",
        dateBirth: "01/03/1980"
      }),
    } as any;

    const result = await handler(event, context, () => null) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe("La fecha de nacimiento debe ser válida y estar en el formato YYYY-MM-DD.");
  });

  it('debería devolver un error 400 cuando falta la fecha de nacimiento', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({
        email: "user01@gmail.com",
        name: "Patricia",
        paternalSurname: "Diaz",
        maternalSurname: "Lopez",
        dateBirth: ""
      }),
    } as any;

    const result = await handler(event, context, () => null) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe("La fecha de nacimiento es un campo obligatorio.");
  });
});