import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { environmentJSON } from '../jsonManager';
import { EnvironmentListType, SetEnvironmentInput } from '../../types/index';

@Resolver()
export default class EnvironmentResolver {
  @Query(() => [EnvironmentListType])
  async environmentList() {
    return await environmentJSON.getAll();
  }

  @Query(() => [String])
  async environmentNames() {
    const data = await environmentJSON.getAll();
    return data.map((x) => x.name);
  }

  @Mutation(() => Boolean)
  async setEnvironment(@Arg('SetEnvironmentInput') input: SetEnvironmentInput) {
    const environment = await environmentJSON.getByField('name', input.name);
    if (environment) {
      environment.value = input.value || '';
      await environmentJSON.updateByField('name', input.name, environment);
    } else {
      await environmentJSON.add({
        name: input.name,
        value: input.value,
      });
    }
    return true;
  }

  @Mutation(() => Boolean)
  async delEnvironment(@Arg('Name') name: string) {
    const environments = await environmentJSON.getAll();
    if (environments.length === 1) {
      return false;
    }
    const environment = await environmentJSON.getByField('name', name);
    if (environment) {
      const result = await environmentJSON.deleteByField('name', name);
      return result !== -1;
    }
  }
}
