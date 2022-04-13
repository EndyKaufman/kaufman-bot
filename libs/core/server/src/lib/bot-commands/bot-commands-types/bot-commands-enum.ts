import { getText } from 'class-validator-multi-lang';

export const BotCommandsEnum = {
  help: getText('help'),
  get: getText('get'),
  state: getText('state'),
  reset: getText('reset'),
};

export const BotCommandsCategory = {
  system: getText('system'),
  user: getText('user'),
};
