export const BOT_IN_GROUPS_CONFIG = Symbol('BOT_IN_GROUPS_CONFIG');

export interface BotInGroupsConfig {
  title: string;
  name: string;
  descriptions: string;
  usage: string[];
  spyWords: string[];
  botNames: { [langCode: string]: string[] };
  botMeetingInformation: { [langCode: string]: string[] };
  botDoNotHaveFullAccess: { [langCode: string]: string[] };
  botNowHaveFullAccess: { [langCode: string]: string[] };
}
