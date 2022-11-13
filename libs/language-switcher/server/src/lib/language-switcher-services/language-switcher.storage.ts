export const LANGUAGE_SWITCHER_STORAGE = 'LANGUAGE_SWITCHER_STORAGE';

export type LanguageSwitcherStorageProvider = Pick<
  LanguageSwitcherStorage,
  'getLanguageOfUser' | 'setLanguageOfUser'
>;

export class LanguageSwitcherStorage {
  private readonly languageOfUsers: Record<string, string> = {};

  async getLanguageOfUser(userId: string): Promise<string | null> {
    const currentLanguageCode = this.languageOfUsers[userId];
    if (currentLanguageCode) {
      return currentLanguageCode;
    }
    return null;
  }

  async setLanguageOfUser(userId: string, langCode: string): Promise<void> {
    this.languageOfUsers[userId] = langCode;
  }
}
