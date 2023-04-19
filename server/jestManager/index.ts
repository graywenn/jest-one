import { ChildProcess, spawn } from 'child_process';
import { join, normalize } from 'path';
import { root } from '../constants';

export default class JestManager {
  process: ChildProcess;

  constructor() {}

  runTag(names: string) {
    this.executeJest([`-t "${names}"`, '--verbose=false'], false);
  }

  runFile(path: string) {
    this.executeJest([this.getPatternForPath(path), '--verbose=false'], false);
  }

  executeJest(args: string[] = [], inherit = false) {
    const finalArgs = [
      '-r',
      this.getPatchFilePath(),
      './node_modules/jest/bin/jest.js',
      `--config=${root}/jest.config.ts`,
      ...args,
    ];

    this.process = spawn('node', finalArgs, {
      cwd: normalize(root),
      shell: true,
      stdio: inherit ? 'inherit' : 'pipe',
    });

    this.process.on('exit', () => {
      this.stop();
    });

    this.process.stdout &&
      this.process.stdout.on('data', (data: string) => {
        console.log('stdout \n', data.toString());
      });

    this.process.stderr &&
      this.process.stderr.on('data', (data: string) => {
        console.log('stderr \n', data.toString());
      });
  }

  stop() {
    if (this.process) {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', '' + this.process.pid, '/T', '/F']);
      } else {
        this.process.kill();
      }
    }
  }

  getPatchFilePath() {
    return `"${join(__dirname, './scripts/patch.js')}"`;
  }

  getPatternForPath(path: string) {
    let replacePattern = /\//g;
    if (process.platform === 'win32') {
      replacePattern = /\\/g;
    }
    return `^${path.replace(replacePattern, '.')}$`;
  }
}
