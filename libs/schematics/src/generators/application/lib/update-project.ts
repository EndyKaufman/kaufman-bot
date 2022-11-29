import type { Tree } from '@nrwl/devkit';
import { joinPathFragments, updateJson } from '@nrwl/devkit';
import type { NormalizedOptions } from '../schema';

export function updateProject(tree: Tree, options: NormalizedOptions): void {
  updateJson(
    tree,
    joinPathFragments(options.appProjectRoot, 'project.json'),
    (json) => {
      json.targets.build.options.assets = [
        ...json.targets.build.options.assets,
        {
          glob: '**/*.json',
          input: './node_modules/class-validator-multi-lang/i18n/',
          output: './assets/i18n/class-validator-messages/',
        },
        {
          glob: '**/*.json',
          input: './node_modules/@kaufman-bot/core-server/i18n/',
          output: './assets/i18n/core-server/',
        },
        {
          glob: '**/*.json',
          input: './node_modules/@kaufman-bot/bot-in-groups-server/i18n/',
          output: './assets/i18n/bot-in-groups-server/',
        },
        {
          glob: '**/*.json',
          input: './node_modules/@kaufman-bot/debug-messages-server/i18n/',
          output: './assets/i18n/debug-messages-server/',
        },
        {
          glob: '**/*.json',
          input: './node_modules/@kaufman-bot/facts-generator-server/i18n/',
          output: './assets/i18n/facts-generator-server/',
        },
        {
          glob: '**/*.json',
          input: './node_modules/@kaufman-bot/html-scraper-server/i18n/',
          output: './assets/i18n/html-scraper-server/',
        },
        {
          glob: '**/*.json',
          input:
            './node_modules/@kaufman-bot/language-switcher-server/i18n/',
          output: './assets/i18n/language-switcher-server/',
        },
        {
          glob: '**/*.json',
          input: './node_modules/@kaufman-bot/short-commands-server/i18n/',
          output: './assets/i18n/short-commands-server/',
        },
      ];
      return json;
    }
  );
}
