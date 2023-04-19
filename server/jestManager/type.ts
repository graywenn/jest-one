import { Events } from '../constants/enums';
import { ResultStatus } from '../constants/type';

export interface JestResultItem {
  fullName: string;
  title: string;
  numPassingAsserts: number;
  status: ResultStatus;
  failureMessages: string[];
  ancestorTitles: string[];
  duration: number;
}

export class JestResultConsole {
  message: string;
  origin: string;
  type: string;
}

export interface JestTestResult {
  testId: string;
  path: string;
  failureMessage: string;
  console: JestResultConsole[];
  aggregatedResult: any;
  numFailingTests: number;
  numPassingTests: number;
  numPendingTests: number;
  numTodoTests: number;
  testResults: JestResultItem[];
}

export interface JestTestEventParams {
  testId: string;
  path: string;
  event: Events;
}

export interface JestRunCompleted {
  numFailedTestSuites: number;
  numFailedTests: number;
  numPassedTestSuites: number;
  numPassedTests: number;
  numRuntimeErrorTestSuites: number;
  numTotalTestSuites: number;
  numTotalTests: number;
}
