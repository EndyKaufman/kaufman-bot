export const BOT_COMMANDS_CONFIG = 'BOT_COMMANDS_CONFIG';

export interface BotCommandsConfig {
  admins: string[];
  version: string;
  commit: string;
  date: string;
  maxRecursiveDepth?: number;
  disableBotInfo?: boolean;
  botNames?: { [langCode: string]: string[] };
  botMeetingInformation?: { [langCode: string]: string[] };
  prepareCommandString?: (command: string) => string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultGlobalContext?: Record<string, any>;
}
