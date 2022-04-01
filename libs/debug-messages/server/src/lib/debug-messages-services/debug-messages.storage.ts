import { PrismaClientService } from '@kaufman-bot/core/server';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DebugMessagesStorage {
  private readonly debugModeOfUsers: Record<number, boolean> = {};

  constructor(private readonly prismaClientService: PrismaClientService) {}

  async getDebugModeOfUser(telegramUserId: number): Promise<boolean> {
    const currentDebugMode = this.debugModeOfUsers[telegramUserId];
    if (currentDebugMode) {
      return currentDebugMode;
    }
    try {
      const currentDebugModeFromDatabase =
        await this.prismaClientService.user.findFirst({
          where: { telegramId: telegramUserId.toString() },
          rejectOnNotFound: true,
        });
      this.debugModeOfUsers[telegramUserId] =
        currentDebugModeFromDatabase.debugMode;
      return this.debugModeOfUsers[telegramUserId];
    } catch (error) {
      return false;
    }
  }

  async setDebugModeOfUser(userId: number, debugMode: boolean): Promise<void> {
    await this.prismaClientService.user.upsert({
      create: { telegramId: userId.toString(), debugMode },
      update: { debugMode },
      where: { telegramId: userId.toString() },
    });
    this.debugModeOfUsers[userId] = debugMode;
  }
}
