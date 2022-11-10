import type { Tree } from '@nrwl/devkit';
import { updateJson } from '@nrwl/devkit';

export function updateTsConfig(tree: Tree) {
  if (tree.exists('tsconfig.base.json')) {
    updateJson(tree, 'tsconfig.base.json', (json) => {
      json['compilerOptions'] = {
        ...json['compilerOptions'],
        allowSyntheticDefaultImports: true,
        strictNullChecks: true,
        noImplicitOverride: true,
        strictPropertyInitialization: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
        esModuleInterop: true,
        noImplicitAny: false,
      };
      return json;
    });
  }
}

export function addScript(tree: Tree, projectName: string) {
  updateJson(tree, 'package.json', (json) => {
    json['scripts'] = {
      ...json['scripts'],
      rucken: 'rucken',
      nx: 'nx',
      lint: 'npm run tsc:lint && nx workspace-lint && npm run nx -- run-many --target=lint --all',
      'lint:fix':
        'npm run tsc:lint && nx run-many --target=lint --all --fix && nx format:write --all',
      'tsc:lint': 'tsc --noEmit -p tsconfig.base.json',
      generate: 'npm run rucken -- prepare && npm run lint:fix',
    };
    if (!json['scripts'][`serve:${projectName}-local`]) {
      json['scripts'][
        `serve:${projectName}-local`
      ] = `export $(xargs < ./.env.local) > /dev/null 2>&1 && npm run nx -- serve ${projectName}`;
    }
    return json;
  });
}

export function addGitIgnoreEntry(host: Tree) {
  if (host.exists('.gitignore')) {
    let content = host.read('.gitignore', 'utf-8');

    if (!content?.includes('*.env.*')) {
      content = `${content}\n*.env.*\n`;
    }
    host.write('.gitignore', content);
  } else {
    host.write('.gitignore', `*.env.*\n`);
  }
}

export function addEnvFilesEntry(host: Tree, botName: string) {
  append('.env.local');
  append('.env-example.local');

  function append(filename: string) {
    let content = '';
    if (host.exists(filename)) {
      content = host.read(filename, 'utf-8') || '';
    }
    const contentRows = content.split('\n');
    const newRows: string[] = [];
    const rows = [
      `TELEGRAM_BOT_TOKEN=`,
      `TELEGRAM_BOT_WEB_HOOKS_DOMAIN=`,
      `TELEGRAM_BOT_WEB_HOOKS_PATH=`,
      `TELEGRAM_BOT_ADMINS=`,
      `BOT_NAMES=${botName}`,
      `BOT_NAMES_RU=${botName}`,
    ];
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      let founded = false;
      for (
        let contentRowindex = 0;
        contentRowindex < contentRows.length;
        contentRowindex++
      ) {
        const contentRow = contentRows[contentRowindex];
        if ((contentRow || '').split('=')[0] === (row || '').split('=')[0]) {
          founded = true;
        }
      }
      if (!founded) {
        newRows.push(row);
      }
    }
    host.write(
      filename,
      [
        ...(contentRows.length === 1 && !contentRows[0] ? [] : contentRows),
        ...newRows,
      ].join('\n')
    );
  }
}
