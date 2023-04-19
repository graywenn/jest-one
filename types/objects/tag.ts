import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class TestTagListType {
  @Field()
  public name: string;
  @Field()
  public tag: string;
}

@ObjectType()
export class TagListType {
  @Field()
  public name: string;
}
