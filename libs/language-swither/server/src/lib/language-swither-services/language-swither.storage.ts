export const LANGUAGE_SWITHER_STORAGE = 'LANGUAGE_SWITHER_STORAGE';

export type LanguageSwitherStorageProvider = Pick<
  LanguageSwitherStorage,
  'getLanguageOfUser' | 'setLanguageOfUser'
>;

export class LanguageSwitherStorage {
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
