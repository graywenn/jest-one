import path from 'path';
import { buildSchema } from 'type-graphql';
import { pubSub } from '../event-emitter';
import TesterResolver from './test.resolver';
import TestResultResolver from './result.resolver';
import TestFileResolver from './files.resolver';
import TestTagResolver from './tag.resolver';
import EnvironmentResolver from './environment.resolver';

export async function getSchema() {
  return await buildSchema({
    validate: false,
    resolvers: [
      TesterResolver,
      TestResultResolver,
      TestFileResolver,
      TestTagResolver,
      EnvironmentResolver,
    ],
    pubSub: pubSub,
    // orphanedTypes: [Tester, Jester],
    emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
  });
}
