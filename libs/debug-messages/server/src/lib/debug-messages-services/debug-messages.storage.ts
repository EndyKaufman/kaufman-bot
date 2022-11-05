export const DEBUG_MESSAGES_STORAGE = 'DEBUG_MESSAGES_STORAGE';

export type DebugMessagesStorageProvider = Pick<
  DebugMessagesStorage,
  'getDebugModeOfUser' | 'setDebugModeOfUser'
>;

export class DebugMessagesStorage {
  private readonly debugModeOfUsers: Record<string, boolean> = {};

  async getDebugModeOfUser(userId: string): Promise<boolean> {
    const currentDebugMode = this.debugModeOfUsers[userId];
    if (currentDebugMode) {
      return currentDebugMode;
    }
    return false;
  }

  async setDebugModeOfUser(userId: string, debugMode: boolean): Promise<void> {
    this.debugModeOfUsers[userId] = debugMode;
  }
}
