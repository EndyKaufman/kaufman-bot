import { PrismaClientService } from '@kaufman-bot/core/server';
import { Injectable } from '@nestjs/common';
import { DEFAULT_LANGUAGE } from '../language-swither-config/language-swither.config';

@Injectable()
export class LanguageSwitherStorage {
  private readonly languageOfUsers: Record<number, string> = {};

  constructor(private readonly prismaClientService: PrismaClientService) {}

  async getLanguageOfUser(
    userId: number,
    defaultLangCode?: string
  ): Promise<string> {
    const currentLanguageCode = this.languageOfUsers[userId];
    if (currentLanguageCode) {
      return currentLanguageCode;
    }
    try {
      const currentLanguageCodeFromDatabase =
        await this.prismaClientService.user.findFirst({
          where: { telegramId: userId.toString() },
          rejectOnNotFound: true,
        });
      this.languageOfUsers[userId] = currentLanguageCodeFromDatabase.langCode;
      return this.languageOfUsers[userId];
    } catch (error) {
      return defaultLangCode || DEFAULT_LANGUAGE;
    }
  }

  async setLanguageOfUser(userId: number, langCode: string): Promise<void> {
    await this.prismaClientService.user.upsert({
      create: { telegramId: userId.toString(), langCode },
      update: { langCode },
      where: { telegramId: userId.toString() },
    });
    this.languageOfUsers[userId] = langCode;
  }
}
