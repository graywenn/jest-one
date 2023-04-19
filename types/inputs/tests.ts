import { Field, InputType } from 'type-graphql';

@InputType()
export class TestStartInput {
  @Field()
  environment: string;
  @Field()
  tag: string;
}

@InputType()
export class TestListInput {
  @Field()
  testId: string;
}
