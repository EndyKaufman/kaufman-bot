export interface BotCommandsToolsGenerateHelpMessageOptions {
  locale: string;
  name: string;
  descriptions: string;
  usage: string[];
  contextUsage?: string[];
  customHelpFields?: { [field: string]: string[] };
}
