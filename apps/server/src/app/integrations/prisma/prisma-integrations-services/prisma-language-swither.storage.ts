import { LanguageSwitherStorageProvider } from '@kaufman-bot/language-swither-server';
import { PrismaClientService } from '@kaufman-bot/prisma-server';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaLanguageSwitherStorage
  implements LanguageSwitherStorageProvider
{
  private readonly languageOfUsers: Record<number, string> = {};

  constructor(private readonly prismaClientService: PrismaClientService) {}

  async getLanguageOfUser(telegramUserId: number): Promise<string | null> {
    const currentLanguageCode = this.languageOfUsers[telegramUserId];
    if (currentLanguageCode) {
      return currentLanguageCode;
    }
    try {
      const currentLanguageCodeFromDatabase =
        await this.prismaClientService.user.findFirst({
          where: { telegramId: telegramUserId.toString() },
          rejectOnNotFound: true,
        });
      this.languageOfUsers[telegramUserId] =
        currentLanguageCodeFromDatabase.langCode;
      return this.languageOfUsers[telegramUserId];
    } catch (error) {
      return null;
    }
  }

  async setLanguageOfUser(
    telegramUserId: number,
    langCode: string
  ): Promise<void> {
    await this.prismaClientService.user.upsert({
      create: { telegramId: telegramUserId.toString(), langCode },
      update: { langCode },
      where: { telegramId: telegramUserId.toString() },
    });
    this.languageOfUsers[telegramUserId] = langCode;
  }
}
