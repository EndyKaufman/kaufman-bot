export const BOT_COMMANDS_CONFIG = 'BOT_COMMANDS_CONFIG';

export interface BotCommandsConfig {
  admins: string[];
  version: string;
  commit: string;
  date: string;
  maxRecursiveDepth?: number;
  disableBotInfo?: boolean;
  prepareCommandString?: (command: string) => string;
}
