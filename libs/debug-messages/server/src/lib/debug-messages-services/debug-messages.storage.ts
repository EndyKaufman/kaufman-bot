export const DEBUG_MESSAGES_STORAGE = 'DEBUG_MESSAGES_STORAGE';

export type DebugMessagesStorageProvider = Pick<
  DebugMessagesStorage,
  'getDebugModeOfUser' | 'setDebugModeOfUser'
>;

export class DebugMessagesStorage {
  private readonly debugModeOfUsers: Record<number, boolean> = {};

  async getDebugModeOfUser(telegramUserId: number): Promise<boolean> {
    const currentDebugMode = this.debugModeOfUsers[telegramUserId];
    if (currentDebugMode) {
      return currentDebugMode;
    }
    return false;
  }

  async setDebugModeOfUser(userId: number, debugMode: boolean): Promise<void> {
    this.debugModeOfUsers[userId] = debugMode;
  }
}
