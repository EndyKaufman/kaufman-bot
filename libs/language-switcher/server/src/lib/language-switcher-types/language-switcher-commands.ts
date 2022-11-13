import { getText } from 'class-validator-multi-lang';

export const LanguageSwitcherCommandsEnum = {
  set: getText('set'),
  change: getText('change'),
  ['quick change']: getText('quick change'),
  my: getText('my'),
  current: getText('current'),
};
