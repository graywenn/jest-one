import 'reflect-metadata';

import { createServer } from 'http';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { getSchema } from './apis';
import { initJsonFiles } from './jsonManager';
import { root } from './constants';
import handlerEventApis from './jestManager/handlerEventApis';

const JEST_ONE_PORT = 4000;
async function bootstrap() {
  const app = express();
  process.env.JEST_ONE_PORT = `${JEST_ONE_PORT}`;
  const schema = await getSchema();
  await initJsonFiles();
  handlerEventApis(app);

  const httpServer = createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server)
  );

  httpServer.listen(JEST_ONE_PORT, () => {
    console.log(
      `Server is now running on http://localhost:${JEST_ONE_PORT}/graphql`
    );
  });
}

bootstrap();
