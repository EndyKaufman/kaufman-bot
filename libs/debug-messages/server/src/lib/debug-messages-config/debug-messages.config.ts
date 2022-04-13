export const DEBUG_MESSAGES_CONFIG = 'DEBUG_MESSAGES_CONFIG';

export interface DebugMessagesConfig {
  title: string;
  name: string;
  descriptions: string;
  usage: string[];
  spyWords: string[];
  category: string;
}
