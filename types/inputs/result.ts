import { Field, InputType } from 'type-graphql';

@InputType()
export class TestResultListInput {
  @Field()
  testId: string;
}
