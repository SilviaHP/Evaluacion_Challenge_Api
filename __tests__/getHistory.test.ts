import { handler } from '../src/handlers/getHistory';
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('GetHistory Handler', () => {
  let mock: MockAdapter;
  const context: Context = {} as any;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('debería recuperar la información de la tabla HistoryCharacter sin parámetros', async () => {
    mock.onGet('https://api.example.com/history').reply(200, {
      items: [
        {
          id: "f261301e-58dc-414d-87b5-936db3bd9199",
          characterName: "Luke Skywalker",
          planetName: "Tatooine",
          planetImageUrl: "https://images.unsplash.com/photo-1568387380357-ba90334a6541?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2Nzg4MzN8MHwxfHNlYXJjaHwxfHxUYXRvb2luZXxlbnwwfHx8fDE3MzI3ODQ4MDl8MA&ixlib=rb-4.0.3&q=80&w=400",
          timestamp: 1732648386613
        },
        // Otros ítems...
      ],
      lastEvaluatedKey: null
    });

    const event: APIGatewayProxyEvent = {
      queryStringParameters: null,
    } as any;

    const result = await handler(event, context, () => null) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).items).toBeInstanceOf(Array);
  });

  it('debería recuperar la información de la tabla HistoryCharacter con limit', async () => {
    mock.onGet('https://api.example.com/history', { params: { limit: 5 } }).reply(200, {
      items: [
        {
          id: "f261301e-58dc-414d-87b5-936db3bd9199",
          characterName: "Luke Skywalker",
          planetName: "Tatooine",
          planetImageUrl: "https://images.unsplash.com/photo-1568387380357-ba90334a6541",
          timestamp: 1732648386613
        },
        // Otros ítems...
      ],
      lastEvaluatedKey: {
        timestamp: { N: "1732648386613" },
        id: { S: "f261301e-58dc-414d-87b5-936db3bd9199" }
      }
    });

    const event: APIGatewayProxyEvent = {
      queryStringParameters: {
        limit: "5"
      },
    } as any;

    const result = await handler(event, context, () => null) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).items).toBeInstanceOf(Array);
    expect(JSON.parse(result.body).lastEvaluatedKey).toBeDefined();
  });

  it('debería recuperar la información de la tabla HistoryCharacter con limit y lastEvaluatedKey', async () => {
    mock.onGet('https://api.example.com/history', {
      params: {
        limit: 5,
        lastEvaluatedKey: '{"timestamp":{"N":"1732648386613"},"id":{"S":"f261301e-58dc-414d-87b5-936db3bd9199"}}'
      }
    }).reply(200, {
      items: [
        {
          id: "f261301e-58dc-414d-87b5-936db3bd9199",
          characterName: "Luke Skywalker",
          planetName: "Tatooine",
          planetImageUrl: "https://images.unsplash.com/photo-1568387380357-ba90334a6541",
          timestamp: 1732648386613
        },
        // Otros ítems...
      ],
      lastEvaluatedKey: {
        timestamp: { N: "1732648386613" },
        id: { S: "f261301e-58dc-414d-87b5-936db3bd9199" }
      }
    });

    const event: APIGatewayProxyEvent = {
      queryStringParameters: {
        limit: "5",
        lastEvaluatedKey: JSON.stringify({
          timestamp: { N: "1732648386613" },
          id: { S: "f261301e-58dc-414d-87b5-936db3bd9199" }
        })
      },
    } as any;

    const result = await handler(event, context, () => null) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).items).toBeInstanceOf(Array);
    expect(JSON.parse(result.body).lastEvaluatedKey).toBeDefined();
  });
});