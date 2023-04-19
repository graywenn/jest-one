import { Field, InputType } from 'type-graphql';

@InputType()
export class SetTestTagInput {
  @Field()
  name: string;
  @Field({ nullable: true })
  tag: string;
}

@InputType()
export class SetTagInput {
  @Field()
  name: string;
}
