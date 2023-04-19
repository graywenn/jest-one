import bodyParser from 'body-parser';
import { Application } from 'express';
import { JestTestEventParams, JestTestResult } from './type';
import { ResultItem } from '../jsonManager/entities/result';
import { TestResultManager } from '../jsonManager/testResultManager';
import { pubSub } from '../event-emitter';
import { Events, TestStatus } from '../constants/enums';
import { testListJSON } from '../jsonManager';
export default function handlerEventApis(expressApp: Application) {
  expressApp.use(
    bodyParser.json({
      limit: '50mb',
    })
  );

  expressApp.post(
    '/test-start',
    async ({ body }: { body: JestTestEventParams }, res) => {
      const { testId, path } = body;
      await pubSub.publish(Events.TEST_START, {
        event: Events.TEST_START,
        testId,
        path,
      });
      res.send('ok');
    }
  );

  expressApp.post(
    '/test-result',
    async ({ body }: { body: JestTestResult }, res) => {
      const { testId, path } = body;
      const testResultManager = await new TestResultManager(testId);
      const testResult = await testResultManager.getByField('testId', testId);

      let itemDuration = 0;
      const resultItems = body.testResults.map((item) => {
        itemDuration += item.duration || 0;
        return {
          title: item.title,
          status: item.status,
          fullName: item.fullName,
          failureMessages: item.failureMessages,
          duration: item.duration,
          ancestorTitles: item.ancestorTitles,
        } as ResultItem;
      });

      testResult.testItems.push({
        path: body.path,
        failureMessage: body.failureMessage,
        numFailingTests: body.numFailingTests,
        numPassingTests: body.numPassingTests,
        numPendingTests: body.numPendingTests,
        numTodoTests: body.numTodoTests,
        console: body.console || [],
        itemDuration,
        resultItems,
      });

      testResult.numFailingTests += body.numFailingTests;
      testResult.numPassingTests += body.numPassingTests;
      testResult.numPendingTests += body.numPendingTests;
      testResult.numTodoTests += body.numTodoTests;
      testResult.totalDuration += itemDuration;

      await testResultManager.updateByField('testId', testId, testResult);

      await pubSub.publish(Events.TEST_RESULT, {
        event: Events.TEST_RESULT,
        testId,
        path,
      });
      res.send('ok');
    }
  );

  expressApp.post(
    '/run-start',
    async ({ body }: { body: JestTestEventParams }, res) => {
      await pubSub.publish(Events.RUN_START, {
        event: Events.RUN_START,
        testId: body.testId,
      });
      res.send('ok');
    }
  );

  expressApp.post('/run-complete', async ({ body }, res) => {
    const { testId } = body;
    let tester = await testListJSON.getByField('id', testId);
    await testListJSON.updateByField('id', testId, {
      ...tester,
      status: TestStatus.Successful,
    });
    await pubSub.publish(Events.RUN_COMPLETE, {
      event: Events.RUN_COMPLETE,
      testId: testId,
    });
    res.send('ok');
  });
}
