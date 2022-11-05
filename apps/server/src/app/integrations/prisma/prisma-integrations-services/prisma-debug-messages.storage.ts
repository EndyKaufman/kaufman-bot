import { DebugMessagesStorageProvider } from '@kaufman-bot/debug-messages-server';
import { PrismaClientService } from '@kaufman-bot/prisma-server';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaDebugMessagesStorage
  implements DebugMessagesStorageProvider
{
  private readonly debugModeOfUsers: Record<string, boolean> = {};

  constructor(private readonly prismaClientService: PrismaClientService) {}

  async getDebugModeOfUser(userId: string): Promise<boolean> {
    const currentDebugMode = this.debugModeOfUsers[userId];
    if (currentDebugMode) {
      return currentDebugMode;
    }
    try {
      const currentDebugModeFromDatabase =
        await this.prismaClientService.user.findFirstOrThrow({
          where: { telegramId: userId },
        });
      this.debugModeOfUsers[userId] = currentDebugModeFromDatabase.debugMode;
      return this.debugModeOfUsers[userId];
    } catch (error) {
      return false;
    }
  }

  async setDebugModeOfUser(userId: string, debugMode: boolean): Promise<void> {
    await this.prismaClientService.user.upsert({
      create: { telegramId: userId, debugMode },
      update: { debugMode },
      where: { telegramId: userId },
    });
    this.debugModeOfUsers[userId] = debugMode;
  }
}
