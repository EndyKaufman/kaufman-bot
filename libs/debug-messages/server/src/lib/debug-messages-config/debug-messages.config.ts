export const DEBUG_MESSAGES_CONFIG = 'DEBUG_MESSAGES_CONFIG';

export interface DebugMessagesConfig {
  name: string;
  descriptions: string;
  usage: string[];
  spyWords: string[];
}
