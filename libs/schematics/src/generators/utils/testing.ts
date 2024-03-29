import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyV1Workspace } from '@nrwl/devkit/testing';

export function createTreeWithNestApplication(appName: string): Tree {
  const tree = createTreeWithEmptyV1Workspace();
  tree.write(
    'workspace.json',
    String.raw`
      {
        "projects": {
          "${appName}": {
            "root": "apps/api",
            "sourceRoot": "apps/api/src",
            "projectType": "application",
            "prefix": "api",
            "targets":{}
          }
        }
      }
    `
  );

  return tree;
}
