import {
  Resolver,
  Mutation,
  Arg,
  Query,
  Subscription,
  Root,
  ResolverInterface,
  Args,
  InputType,
  Field,
} from 'type-graphql';
import { Events, TestStatus } from '../constants/enums';
import JestManager from '../jestManager';
import { testListJSON, testTagJSON } from '../jsonManager';
import { uuid } from '../utils/uuid';
import { TestResultManager } from '../jsonManager/testResultManager';
import { JestTestEventParams } from '../jestManager/type';
import { localeTime } from '../utils/date';
import { TestListType, JestTestType, TestStartInput } from '../../types';
import { pubSub } from '../event-emitter';

@Resolver()
export default class TesterResolver {
  jestManager: JestManager;
  constructor() {
    this.jestManager = new JestManager();
  }

  @Subscription(() => JestTestType, {
    topics: [
      Events.RUN_START,
      Events.TEST_START,
      Events.TEST_RESULT,
      Events.RUN_COMPLETE,
    ],
  })
  async jestEvents(@Root() params: JestTestEventParams): Promise<JestTestType> {
    return params;
  }

  @Mutation(() => String)
  async start(@Arg('TestStartInput') input: TestStartInput) {
    const { environment, tag } = input;
    const testTags = await testTagJSON.getAll();
    const names = testTags
      .filter((t) => t.tag.toUpperCase().includes(tag.toUpperCase()))
      .map((t) => t.name)
      .join('|');
    if (!names) {
      return 'Not found tag tests.';
    }

    const testId = uuid();
    await testListJSON.add({
      id: testId,
      status: TestStatus.Running,
      tag,
      environment,
      createTime: localeTime(),
    });

    await pubSub.publish(Events.RUN_START, {
      testId: testId,
      event: Events.TEST_START,
    });

    process.env.JEST_ONE_TEST_ID = testId;
    const resultManager = await new TestResultManager(testId);
    await resultManager.init([
      {
        testId,
        testItems: [],
        numFailingTests: 0,
        numPassingTests: 0,
        numPendingTests: 0,
        numTodoTests: 0,
        totalDuration: 0,
      },
    ]);

    this.jestManager.runTag(names);
    return testId;
  }

  @Mutation(() => Boolean)
  async stop() {
    await this.jestManager.stop();
  }

  @Query(() => [TestListType])
  async list() {
    const result = [] as TestListType[];
    const testList = await testListJSON.getAll();

    for (const test of testList) {
      const testResultJSON = new TestResultManager(test.id);
      const testResult = await testResultJSON.getByField('testId', test.id);
      result.push({
        id: test.id,
        environment: test.environment,
        status: test.status,
        tag: test.tag,
        createTime: test.createTime,
        totalDuration: testResult.totalDuration,
        numFailingTests: testResult.numFailingTests,
        numPassingTests: testResult.numPassingTests,
        numPendingTests: testResult.numPendingTests,
        numTodoTests: testResult.numTodoTests,
      });
    }
    return result.sort(
      (a, b) =>
        (new Date(b.createTime) as any) - (new Date(a.createTime) as any)
    );
  }
}
