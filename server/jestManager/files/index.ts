import { spawnSync } from 'child_process';
import { extname, join, normalize, sep } from 'path';
import { root } from '../../constants';
import { ITestFile } from './type';

export function getTestFiles() {
  const projectRoot = normalize(root);
  const process = spawnSync(
    'node',
    ['./node_modules/jest/bin/jest.js', '--listTests', '--json'],
    {
      cwd: projectRoot,
      shell: true,
      stdio: 'pipe',
    }
  );

  const filesString = process.stdout.toString().trim();
  const files: string[] = JSON.parse(filesString || '[]');
  return files;
}

export async function getTestFileTree() {
  const projectRoot = normalize(root);
  const files = await getTestFiles();
  const relativeFiles = files.map((file) => file.replace(projectRoot, ''));
  const testFiles = [] as ITestFile[];
  relativeFiles.forEach((path) => {
    const tokens = path.split(sep).filter((token) => token.trim() !== '');
    let currentPath = '';
    let parentPath = '';
    tokens.forEach((token) => {
      currentPath = `${currentPath}${sep}${token}`;
      const type = ['.ts', '.js'].includes(extname(currentPath))
        ? 'file'
        : 'directory';
      const path = join(projectRoot, currentPath);
      if (!testFiles.find((x) => x.path === path)) {
        testFiles.push({
          path,
          parent: join(projectRoot, parentPath),
          name: token,
          type,
        });
      }
      parentPath = currentPath;
    });
  });

  const fileMap = Object.entries(testFiles).map(([_, value]: any) => ({
    name: value.name,
    path: value.path,
    parent: value.parent,
    type: value.type,
  }));

  return fileMap;
}
