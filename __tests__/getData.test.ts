import { handler } from "../src/handlers/getData";
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

describe("GetData Handler", () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it("debería obtener datos de un personaje existente", async () => {
    mock
      .onGet("https://swapi.py4e.com/api/people", {
        params: { search: "Luke" },
      })
      .reply(200, {
        results: [
          {
            name: "Luke Skywalker",
            homeworld: "https://swapi.py4e.com/api/planets/1/",
          },
        ],
      });

    mock.onGet("https://swapi.py4e.com/api/planets/1/").reply(200, {
      name: "Tatooine",
    });

    mock
      .onGet("https://api.unsplash.com/search/photos", {
        params: { query: "Tatooine", per_page: 1 },
      })
      .reply(200, {
        results: [
          {
            urls: {
              small:
                "https://images.unsplash.com/photo-1568387380357-ba90334a6541",
            },
          },
        ],
      });

    const event: APIGatewayProxyEvent = {
      queryStringParameters: { characterName: "Luke" },
    } as any;

    const context: Context = {} as any;
    const result = (await handler(
      event,
      context,
      () => null
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      id: expect.any(String),
      characterName: "Luke Skywalker",
      planetName: "Tatooine",
      planetImageUrl:
        "https://images.unsplash.com/photo-1568387380357-ba90334a6541",
      timestamp: expect.any(Number),
    });
  }, 20000); 

  
  it("debería devolver un error 404 para un personaje que no existe", async () => {
    mock
      .onGet("https://swapi.py4e.com/api/people", {
        params: { search: "Unknown" },
      })
      .reply(200, {
        results: [],
      });

    const event: APIGatewayProxyEvent = {
      queryStringParameters: { characterName: "Unknown" },
    } as any;

    const context: Context = {} as any;
    const result = (await handler(
      event,
      context,
      () => null
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body).message).toBe(
      "El personaje no fue encontrado en Swapi."
    );
  }, 20000); 



  it("debería devolver un error 400 cuando falta el parámetro characterName o cuando se coloca otro nombre de parametro", async () => {
    const event: APIGatewayProxyEvent = {
      queryStringParameters: null,
    } as any;

    const context: Context = {} as any;
    const result = (await handler(
      event,
      context,
      () => null
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe(
      "El parametro characterName es requerido."
    );
  }, );
});
