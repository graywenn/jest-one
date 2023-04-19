import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import {
  SetTagInput,
  SetTestTagInput,
  TagListType,
  TestTagListType,
} from '../../types';
import { tagsJSON, testTagJSON } from '../jsonManager';

@Resolver()
export default class TestTagResolver {
  @Query(() => [String])
  async tagNames() {
    const data = await tagsJSON.getAll();
    return data.map((x) => x.name);
  }

  @Query(() => [TagListType])
  async tagList() {
    return await tagsJSON.getAll();
  }

  @Query(() => [TestTagListType])
  async testTagList() {
    return await testTagJSON.getAll();
  }

  @Mutation(() => Boolean)
  async setTestTags(@Arg('SetTestTagInput') input: SetTestTagInput) {
    const testTag = await testTagJSON.getByField('name', input.name);
    if (!input.tag) {
      await testTagJSON.deleteByField('name', input.name);
      return true;
    }
    if (testTag) {
      testTag.tag = input.tag || null;
      await testTagJSON.updateByField('name', input.name, testTag);
    } else {
      await testTagJSON.add({
        name: input.name,
        tag: input.tag,
      });
    }
    return true;
  }

  @Mutation(() => Boolean)
  async setTag(@Arg('SetTagInput') input: SetTagInput) {
    const tag = await tagsJSON.getByField('name', input.name);
    if (tag) {
      tag.name = input.name;
      await tagsJSON.updateByField('name', input.name, tag);
    } else {
      await tagsJSON.add({
        name: input.name,
      });
    }
    return true;
  }

  @Mutation(() => Boolean)
  async delTag(@Arg('Name') name: string) {
    const tags = await tagsJSON.getAll();
    if (tags.length === 1) {
      return false;
    }
    const testTag = await testTagJSON.getByField('tag', name);
    if (testTag) {
      return false;
    }
    const tag = await tagsJSON.getByField('name', name);
    if (tag) {
      const result = await tagsJSON.deleteByField('name', name);
      return result !== -1;
    }
  }
}
