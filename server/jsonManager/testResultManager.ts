import { TestResultEntity } from './entities/result';
import { JsonManager } from './jsonManager';

export class TestResultManager extends JsonManager<TestResultEntity> {
  constructor(testId: string) {
    super(`storages/testResults/${testId}/results.json`);
  }
}
