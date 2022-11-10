export const BOT_COMMANDS_CONFIG = 'BOT_COMMANDS_CONFIG';

export interface BotCommandsConfig {
  admins: string[];
  version: string;
  commit: string;
  date: string;
  maxRecursiveDepth?: number;
  disableBotInfo?: boolean;
  prepareCommandString?: (command: string) => string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultGroupGlobalContext?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultGlobalContext?: Record<string, any>;
}
