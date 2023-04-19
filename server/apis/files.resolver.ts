import { Query, Resolver } from 'type-graphql';
import { TestFileListType } from '../../types';
import { fileJSON, testTagJSON } from '../jsonManager';
import { root } from '../constants';

@Resolver(TestFileListType)
export default class TestFileResolver {
  @Query(() => [TestFileListType])
  async fileList() {
    const testTags = await testTagJSON.getAll();
    const files = await fileJSON.getAll();
    files.forEach((file) => {
      file.path = file.path.replace(`${root}\\`, '');
      file.items = file.items.filter((item) => {
        item['tag'] = testTags.find((x) => x.name === item.name)?.tag;
        return item.type !== 'describe';
      });
    });
    return files;
  }
}
