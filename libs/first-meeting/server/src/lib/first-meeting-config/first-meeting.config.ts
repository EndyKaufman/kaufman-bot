export const FIRST_MEETING_CONFIG = Symbol('FIRST_MEETING_CONFIG');

export interface FirstMeetingConfig {
  title: string;
  name: string;
  descriptions: string;
  usage: string[];
  spyWords: string[];
  botName: { [langCode: string]: string };
  category: string;
}
