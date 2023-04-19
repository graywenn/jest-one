import { TestStatus } from '../../constants/enums';
import { localeTime } from '../../utils/date';

export class TestListEntity {
  constructor(
    public id: string,
    public status: TestStatus,
    public tag: string,
    public environment: string,
    public createTime?: string
  ) {
    createTime = localeTime();
  }
}
