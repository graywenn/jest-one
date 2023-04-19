import { ObjectType, Field } from 'type-graphql';
import { ResultStatus } from '../../common/types';

@ObjectType()
export class ResultItemType {
  @Field()
  public title: string;
  @Field()
  public fullName: string;
  @Field()
  public status: ResultStatus;
  @Field(() => [String])
  public failureMessages: string[];
  @Field(() => [String])
  public ancestorTitles: string[];
  @Field({ nullable: true })
  public duration?: number;
}

@ObjectType()
export class TestItemType {
  @Field()
  public path: string;
  @Field()
  public numFailingTests: number;
  @Field()
  public numPassingTests: number;
  @Field()
  public numPendingTests: number;
  @Field()
  public numTodoTests: number;
  @Field({ nullable: true })
  public failureMessage: string;
  public itemDuration: number;
  @Field(() => [ResultConsoleType])
  public console: ResultConsoleType[];
  @Field(() => [ResultItemType])
  public resultItems: ResultItemType[];
}

@ObjectType()
export class ResultConsoleType {
  @Field()
  public message: string;
  @Field()
  public origin: string;
  @Field()
  public type: string;
}

@ObjectType()
export class TestResultListType {
  @Field()
  public testId: string;
  @Field()
  public numFailingTests: number;
  @Field()
  public numPassingTests: number;
  @Field()
  public numPendingTests: number;
  @Field()
  public numTodoTests: number;
  @Field()
  public totalDuration: number;
  @Field(() => [TestItemType])
  public testItems: TestItemType[];
}
