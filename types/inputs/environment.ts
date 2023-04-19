import { Field, InputType } from 'type-graphql';

@InputType()
export class SetEnvironmentInput {
  @Field()
  name: string;
  @Field({ nullable: true })
  value: string;
}
