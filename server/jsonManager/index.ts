import { JsonManager } from './jsonManager';
import { EnvironmentEntity, TagEntity, TestListEntity } from './entities';
import { getTestFiles } from '../jestManager/files';
import { inspect } from '../ast/inspector';
import { TestFileEntity } from './entities/files';
import TestTagEntity from './entities/testTag';
const basePath = 'storages';

export const testListJSON = new JsonManager<TestListEntity>(
  basePath + '/tests.json'
);
export const tagsJSON = new JsonManager<TagEntity>(basePath + '/tags.json');
export const environmentJSON = new JsonManager<EnvironmentEntity>(
  basePath + '/environment.json'
);
export const fileJSON = new JsonManager<TestFileEntity>(
  basePath + '/files.json'
);
export const testTagJSON = new JsonManager<TestTagEntity>(
  basePath + '/testTag.json'
);

export const initJsonFiles = async () => {
  await testListJSON.init([]);
  await tagsJSON.init([{ name: 'Default' }]);
  await environmentJSON.init([
    {
      name: 'Default',
      value: JSON.stringify({ userName: 'admin', password: '123456' }),
    },
  ]);
  await testTagJSON.init([]);
  await initTestFiles();
};

async function initTestFiles() {
  const files = await getTestFiles();
  const testFiles = [] as TestFileEntity[];
  for (const file of files) {
    const testItem = await inspect(file);
    testFiles.push({
      path: file,
      items: testItem.map((item) => ({
        name: item.name,
        type: item.type,
        parent: item.parent,
      })),
    });
  }
  await fileJSON.init(testFiles, true);
  return testFiles;
}
