export interface ITestFile {
  type: 'directory' | 'file';
  name: string;
  path: string;
  parent: string;
}
