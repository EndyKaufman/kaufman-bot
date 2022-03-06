import { getText } from 'class-validator-multi-lang';

export const LanguageSwitherCommandsEnum = {
  help: getText('help'),
  set: getText('set'),
  change: getText('change'),
  ['quick change']: getText('quick change'),
  my: getText('my'),
  current: getText('current'),
};
