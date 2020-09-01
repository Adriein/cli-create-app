#!/usr/bin/env node

import fs from 'fs';
import { spawnSync } from 'child_process';

//Read the current directory

const files = fs.readdirSync(process.cwd());

// if (files.includes('package.json')) {
//   spawn('mkdir', ['testuo1'], {
//     cwd: `${process.cwd()}/testuo`,
//     stdio: 'inherit',
//   });
// }

const structure: DirectoryTree = {
  root: {
    core: {
      entities: {
        test: 'file',
        test1: 'file',
      },
      errors: 'dir',
      usecases: 'dir',
    },
    infrastructure: {
      data: 'dir',
      repository: 'dir',
    },
    routes: 'dir',
    index: 'file',
  },
  env: 'file',
};

// function bfTraverse(directoryTree: DirectoryTree, path = `${process.cwd()}`) {
//   let dirs: any = [...Object.entries(directoryTree)];
//   let items = dirs.length;
//   let nextPath = [];
//   const provisional = [];
//   for (let i = 0; i < items; i++) {
//     const [key, value] = dirs[i];
//     if (value === 'file') {
//       spawnSync('touch', [key], {
//         cwd: path,
//         stdio: 'inherit',
//       });
//     } else {
//       spawnSync('mkdir', [key], {
//         cwd: path,
//         stdio: 'inherit',
//       });
//     }
//     if (typeof value === 'object') {
//       provisional.push(value);
//       nextPath.push(`${path}/${key}`);
//     }
//   }

//   for (let i = 0; i < provisional.length; i++) {
//     bfTraverse(provisional[i], nextPath[i]);
//   }
// }

type DirectoryTree = { [name: string]: string | Object };
type Branch = [string, string, string | Object][];

class FileSystem {
  private branch!: Branch;
  constructor() {}

  build(directoryTree: DirectoryTree) {
    this.branch = Object.entries(directoryTree).map((element) => [
      process.cwd(),
      ...element,
    ]);

    while (this.branch.length) {
      this.traverseBranch(
        (
          path: string,
          key: string,
          value: string | Object,
          nextBranch: Branch
        ) => {
          if (value === 'file') {
            new File(key, path).create();
            console.log(`creating file ${key} in`, path);
          } else {
            new Folder(key, path).create();
            console.log(`creating folder ${key} in`, path);
          }
          if (typeof value === 'object') {
            const result: Branch = Object.entries(value).map((element) => [
              `${path}/${key}`,
              ...element,
            ]);
            nextBranch.push(...result);
          }
        }
      );
    }
  }

  traverseBranch(fn: Function) {
    const nextBranch: Branch = [];

    for (let [path, key, value] of this.branch) {
      fn.apply(null, [path, key, value, nextBranch]);
    }
    this.branch = [...nextBranch];
  }
}

class Folder {
  private _name: string;
  private _path: string;

  constructor(name: string, path: string) {
    this._name = name;
    this._path = path;
  }

  public create() {
    spawnSync('mkdir', [this._name], {
      cwd: this._path,
      stdio: 'inherit',
    });
  }
}

class File {
  private _name: string;
  private _path: string;

  constructor(name: string, path: string) {
    this._name = name;
    this._path = path;
  }

  public create() {
    spawnSync('touch', [this._name], {
      cwd: this._path,
      stdio: 'inherit',
    });
  }
}

new FileSystem().build(structure);
