export const LANGUAGE_SWITHER_STORAGE = 'LANGUAGE_SWITHER_STORAGE';

export type LanguageSwitherStorageProvider = Pick<
  LanguageSwitherStorage,
  'getLanguageOfUser' | 'setLanguageOfUser'
>;

export class LanguageSwitherStorage {
  private readonly languageOfUsers: Record<number, string> = {};

  async getLanguageOfUser(telegramUserId: number): Promise<string | null> {
    const currentLanguageCode = this.languageOfUsers[telegramUserId];
    if (currentLanguageCode) {
      return currentLanguageCode;
    }
    return null;
  }

  async setLanguageOfUser(
    telegramUserId: number,
    langCode: string
  ): Promise<void> {
    this.languageOfUsers[telegramUserId] = langCode;
  }
}
