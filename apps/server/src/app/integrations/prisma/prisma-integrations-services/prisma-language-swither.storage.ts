import { LanguageSwitherStorageProvider } from '@kaufman-bot/language-swither-server';
import { PrismaClientService } from '@kaufman-bot/prisma-server';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaLanguageSwitherStorage
  implements LanguageSwitherStorageProvider
{
  private readonly languageOfUsers: Record<string, string> = {};

  constructor(private readonly prismaClientService: PrismaClientService) {}

  async getLanguageOfUser(userId: string): Promise<string | null> {
    const currentLanguageCode = this.languageOfUsers[userId];
    if (currentLanguageCode) {
      return currentLanguageCode;
    }
    try {
      const currentLanguageCodeFromDatabase =
        await this.prismaClientService.user.findFirst({
          where: { telegramId: userId },
          rejectOnNotFound: true,
        });
      this.languageOfUsers[userId] = currentLanguageCodeFromDatabase.langCode;
      return this.languageOfUsers[userId];
    } catch (error) {
      return null;
    }
  }

  async setLanguageOfUser(userId: string, langCode: string): Promise<void> {
    await this.prismaClientService.user.upsert({
      create: { telegramId: userId, langCode },
      update: { langCode },
      where: { telegramId: userId },
    });
    this.languageOfUsers[userId] = langCode;
  }
}
