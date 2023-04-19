import { ObjectType, Field } from 'type-graphql';
import { SyntaxType } from '../../server/ast/type';

@ObjectType()
export class TestFileListType {
  @Field()
  public path: string;
  @Field(() => [TestFileItemType])
  public items: TestFileItemType[];
}

@ObjectType()
export class TestFileItemType {
  @Field()
  public name: string;
  @Field()
  public type: SyntaxType;
  @Field({ nullable: true })
  public parent: string;
  @Field({ nullable: true })
  public tag: string;
}
