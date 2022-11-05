export const BOT_IN_GROUPS_CONFIG = 'BOT_IN_GROUPS_CONFIG';

export interface BotInGroupsConfig {
  title: string;
  name: string;
  descriptions: string;
  usage: string[];
  spyWords: string[];
  botNames: { [langCode: string]: string[] };
  botMeetingInformation: { [langCode: string]: string[] };
  category: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultGroupGlobalContext?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultGlobalContext?: Record<string, any>;
}
