import { getText } from 'class-validator-multi-lang';

export const LanguageSwitherCommandsEnum = {
  set: getText('set'),
  change: getText('change'),
  ['quick change']: getText('quick change'),
  my: getText('my'),
  current: getText('current'),
};
