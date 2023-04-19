import { ObjectType, Field } from 'type-graphql';
import { Events } from '../../common/enums';

@ObjectType()
export class JestTestType {
  @Field()
  testId: string;
  @Field({ nullable: true })
  path: string;
  @Field()
  event: Events;
}
