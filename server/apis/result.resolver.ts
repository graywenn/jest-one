import { Arg, Query, Resolver } from 'type-graphql';
import { TestResultManager } from '../jsonManager/testResultManager';
import { TestResultListType, TestResultListInput } from '../../types';

@Resolver()
export default class TestResultResolver {
  @Query(() => [TestResultListType])
  async testResultList(@Arg('TestResultListInput') input: TestResultListInput) {
    const { testId } = input;
    const testResultManager = new TestResultManager(testId);
    return await testResultManager.getAll();
  }
}
