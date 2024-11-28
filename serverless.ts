import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'starwars-planets',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      CACHE_TABLE: { Ref: 'CacheTable' } , 
      TTL_MINUTES: '30',
      HISTORY_TABLE: { Ref: 'HistoryCharacterTable' },
      USER_TABLE: { Ref: 'UserTable' },
      ID_CLIENT_UNSPLASH: 'Client-ID v2nJf8KZcs7FghIQBn0ApbHKJQSLi3YeM6bv1CKSzMg',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [ "dynamodb:GetItem", 
                      "dynamodb:PutItem", 
                      "dynamodb:Scan", 
                      "dynamodb:Query" ],
            Resource: [
              { "Fn::GetAtt": ["CacheTable", "Arn"] },
              { "Fn::GetAtt": ["HistoryCharacterTable", "Arn"]},
              { "Fn::GetAtt": ["UserTable", "Arn"]}
            ],
          },
        ],
      },
    },
  },
  functions: {
    getData: {
      handler: 'src/handlers/getData.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'fusionados',
            cors: true,
          },
        },

      ],
    },
    getHistory: {
      handler: 'src/handlers/getHistory.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'historial',
            cors: true,
          },
        },

      ],
    },
    postData: {
      handler: 'src/handlers/postData.handler',
      events: [
        {
          http: {
            method: 'post',
            path: 'almacenar',
            cors: true,
          },
        },

      ],
    },    
    
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      CacheTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'CacheCharacter',
          BillingMode: "PAY_PER_REQUEST",
          AttributeDefinitions: [
            { AttributeName: 'cacheKey', AttributeType: 'S' }
          ],
          KeySchema: [
            { AttributeName: 'cacheKey', KeyType: 'HASH' }
          ],
          TimeToLiveSpecification: {
            AttributeName: 'ttl',
            Enabled: true
          }
        },
      },

      HistoryCharacterTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'HistoryCharacter',
          BillingMode: "PAY_PER_REQUEST",
          AttributeDefinitions: [
            { AttributeName: 'timestamp', AttributeType: 'N' },
            { AttributeName: 'id', AttributeType: 'S' }
          ],
          KeySchema: [
            { AttributeName: 'timestamp', KeyType: 'HASH' },
            { AttributeName: 'id', KeyType: 'RANGE' }
          ],
        },
      },

      UserTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'User',
          BillingMode: "PAY_PER_REQUEST",
          AttributeDefinitions: [
            { AttributeName: 'email', AttributeType: 'S' },
          ],
          KeySchema: [
            { AttributeName: 'email', KeyType: 'HASH' },
          ],
        },
      },      
      
    },
  },
};

module.exports = serverlessConfiguration;