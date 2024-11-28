# Starwars - Challenge

## Serverless - AWS Node.js Typescript

Este proyecto ha sido generado utilizando la plantilla `aws-nodejs-typescript` del [framework Serverless](https://www.serverless.com/).

Para obtener instrucciones detalladas, consulte la [documentación] (https://www.serverless.com/framework/docs/providers/aws/).

## Instrucciones de instalación/despliegue

Dependiendo de tu gestor de paquetes preferido, sigue las instrucciones a continuación para desplegar tu proyecto.

### Usando NPM

- Ejecute `npm i` para instalar las dependencias del proyecto

- Ejecute `npm install --save-dev jest @types/jest ts-jest` para instalar las dependencias de pruebas


## Para ejecutar pruebas

- Ejecute `npm test` para ejecutar las pruebas unitarias 


## Acerca de la aplicación

- La aplicación permite obtener información de un personaje de Starwars de las Apis de Swapi. Para ello, se debe enviar un request con el nombre del personaje deseado y el servicio se encargará de obtener la información del personaje, de su planeta natal y una url de una imagen del planeta del personaje de la Api de Unsplash, segun la coincidencia de este nombre.

- La aplicación permite obtener un historial de las consultas realizadas por los usuarios.

- Adicionalmente, la aplicación permite registrar un usuario con sus datos personales.

## Estructura del proyecto

La base del código del proyecto esta principalmente ubicado en la carpeta `src` . Esta carpeta se divide en los siguientes directorios:

```
.
├── src/
│   ├── adapters/
│   │   ├── externalServiceAdapter.ts
│   │   ├── persistenceAdapter.ts
│   ├── core/
│   │   ├── ports.ts 
│   │   ├── useCases.ts
│   ├── entities/
│   │   ├── character.ts 
│   │   ├── planet.ts
│   │   ├── user.ts
│   ├── handlers/
│   │   ├── getData.ts
│   │   ├── getHistory.ts
│   │   ├── postData.ts
│   ├── schemas/
│   │   ├── characterSchema.ts 
│   │   ├── historySchema.ts 
│   │   ├── userSchema.ts 
│   ├── utils/
│   │   ├── dateConvertion.ts *
│   │   ├── httpException.ts *
│   │   ├── response.ts *
├── serverless.ts
├── tsconfig.json
├── package.json
├── README.md

```

El código de pruebas se encuentra ubicado en la carpeta `__tests__` . Esta carpeta se divide en los siguientes directorios:
```
.
├── __tests__/
│   ├── core/
│   │   ├── fetchPlanetUseCase.test.ts
│   ├── handlers/
│   │   ├── getData.test.ts
```
