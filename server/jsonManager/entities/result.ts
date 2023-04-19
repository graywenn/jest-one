import { ResultStatus } from '../../constants/type';

export class ResultItem {
  constructor(
    public title: string,
    public fullName: string,
    public status: ResultStatus,
    public failureMessages: string[],
    public ancestorTitles: string[],
    public duration: number
  ) {}
}

export class TestItem {
  constructor(
    public path: string,
    public numFailingTests: number,
    public numPassingTests: number,
    public numPendingTests: number,
    public numTodoTests: number,
    public failureMessage: string,
    public itemDuration: number,
    public console: ResultConsole[],
    public resultItems: ResultItem[]
  ) {}
}

export class ResultConsole {
  message: string;
  origin: string;
  type: string;
}

export class TestResultEntity {
  constructor(
    public testId: string,
    public numFailingTests: number,
    public numPassingTests: number,
    public numPendingTests: number,
    public numTodoTests: number,
    public totalDuration: number,
    public testItems: TestItem[]
  ) {}
}
