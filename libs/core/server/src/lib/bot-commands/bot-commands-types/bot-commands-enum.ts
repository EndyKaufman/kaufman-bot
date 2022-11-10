import { getText } from 'class-validator-multi-lang';

export const BotCommandsEnum = {
  meet: getText('meet'),
  help: getText('help'),
  get: getText('get'),
  state: getText('state'),
  start: getText('start'),
  reset: getText('reset'),
};

export const BotCommandsCategory = {
  system: getText('system'),
  user: getText('user'),
  group: getText('group'),
};
