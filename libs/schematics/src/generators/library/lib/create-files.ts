import type { Tree } from '@nrwl/devkit';
import {
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot,
} from '@nrwl/devkit';
import type { NormalizedOptions } from '../schema';

function capitalizeFirstLetter(text: string | undefined, locale: string) {
  const [first, ...rest] = (text || '').trim();
  return (first || '').toLocaleUpperCase(locale) + rest.join('');
}

export function createFiles(tree: Tree, options: NormalizedOptions): void {
  const substitutions = {
    ...options,
    ...names(options.projectName),
    titleName: names(options.projectName).fileName.split('-').join(' '),
    TitleName: capitalizeFirstLetter(
      names(options.projectName).fileName.split('-').join(' '),
      'en'
    ),
    tmpl: '',
    offsetFromRoot: offsetFromRoot(options.projectRoot),
  };
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files', 'common'),
    options.projectRoot,
    substitutions
  );

  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files', 'service'),
    options.projectRoot,
    substitutions
  );
}
