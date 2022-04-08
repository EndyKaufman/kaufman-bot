export const SHORT_COMMANDS_CONFIG = Symbol('SHORT_COMMANDS_CONFIG');

export interface ShortCommandsConfig {
  title: string;
  name: string;
  descriptions: string;
  usage: string[];
  spyWords: string[];
  commands: { [langCode: string]: { [text: string]: string } };
}
