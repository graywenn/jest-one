import { ObjectType, Field } from 'type-graphql';
import { TestStatus } from '../../common/enums';

@ObjectType()
export class TestListType {
  @Field()
  id: string;
  @Field()
  status: TestStatus;
  @Field()
  environment: string;
  @Field()
  tag: string;
  @Field()
  totalDuration: number;
  @Field()
  numFailingTests: number;
  @Field()
  numPassingTests: number;
  @Field()
  numPendingTests: number;
  @Field()
  numTodoTests: number;
  @Field({ nullable: true })
  createTime: string;
}
