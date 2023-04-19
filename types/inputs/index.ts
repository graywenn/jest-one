import { Field, InputType } from 'type-graphql';

@InputType()
export class NameInput {
  @Field()
  name: string;
}
