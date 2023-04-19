export enum TestStatus {
  'Pending' = 'Pending',
  'Running' = 'Running',
  'Failed' = 'Failed',
  'Successful' = 'Successful',
}

export enum Events {
  TEST_START = 'TEST_START',
  TEST_RESULT = 'TEST_RESULT',
  RUN_START = 'RUN_START',
  RUN_COMPLETE = 'RUN_COMPLETE',
  RUN_SUMMARY = 'RUN_SUMMARY',
}
