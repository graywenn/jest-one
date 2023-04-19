import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class EnvironmentListType {
  @Field()
  public name: string;
  @Field()
  public value: string;
}
