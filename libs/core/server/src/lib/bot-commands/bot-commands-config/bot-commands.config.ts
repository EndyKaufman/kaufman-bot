export const BOT_COMMANDS_CONFIG = Symbol('BOT_COMMANDS_CONFIG');

export interface BotCommandsConfig {
  admins: string[];
  version: string;
  commit: string;
  date: string;
  maxRecursiveDepth?: number;
  prepareCommandString?: (command: string) => string;
}
