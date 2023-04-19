const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

function send(type, body) {
  body['testId'] = process.env.JEST_ONE_TEST_ID;
  const url = 'http://localhost:' + process.env.JEST_ONE_PORT + '/' + type;
  fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'authorization': process.env.JEST_ONE_TOKEN
    },
  });
}

class MyCustomReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  onTestStart(test) {
    send('test-start', {
      path: test.path,
    });
  }

  onTestResult(_, testResult, aggregatedResult) {
    const body = {
      path: testResult.testFilePath,
      failureMessage: testResult.failureMessage,
      console: testResult.console,
      numFailingTests: testResult.numFailingTests,
      numPassingTests: testResult.numPassingTests,
      numPendingTests: testResult.numPendingTests,
      numTodoTests: testResult.numTodoTests,
      testResults: (testResult.testResults || []).map(result => {
        return {
          fullName: result.fullName,
          title: result.title,
          numPassingAsserts: result.numPassingAsserts,
          status: result.status,
          failureMessages: result.failureMessages,
          ancestorTitles: result.ancestorTitles,
          duration: result.duration,
        }
      }),
      aggregatedResult:
        process.env.REPORT_SUMMARY === 'report'
          ? {
            numFailedTests: aggregatedResult.numFailedTests,
            numPassedTests: aggregatedResult.numPassedTests,
            numPassedTestSuites: aggregatedResult.numPassedTestSuites,
            numFailedTestSuites: aggregatedResult.numFailedTestSuites,
          }
          : null,
    }
    send('test-result', body);
  }

  onRunStart() { }

  onRunComplete(_, results) {
    send('run-complete', {
      numFailedTestSuites: results.numFailedTestSuites,
      numFailedTests: results.numFailedTests,
      numPassedTestSuites: results.numPassedTestSuites,
      numPassedTests: results.numPassedTests,
      numRuntimeErrorTestSuites: results.numRuntimeErrorTestSuites,
      numTotalTestSuites: results.numTotalTestSuites,
      numTotalTests: results.numTotalTests,
    });
  }
}

module.exports = MyCustomReporter;
