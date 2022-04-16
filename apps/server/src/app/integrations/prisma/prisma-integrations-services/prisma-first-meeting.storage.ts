import { FirstMeetingStorageProvider } from '@kaufman-bot/first-meeting/server';
import { PrismaClientService } from '@kaufman-bot/prisma/server';
import { Injectable } from '@nestjs/common';
import { FirstMeeting } from '@prisma/client';

@Injectable()
export class PrismaFirstMeetingStorage implements FirstMeetingStorageProvider {
  private readonly firstMeetingOfUsers: Record<number, FirstMeeting> = {};

  constructor(private readonly prismaClientService: PrismaClientService) {}

  async getUserFirstMeeting({
    telegramUserId,
  }: {
    telegramUserId: number;
  }): Promise<FirstMeeting | null> {
    const currentFirstMeetingOfUsers: FirstMeeting =
      this.firstMeetingOfUsers[this.getKey({ telegramUserId })];
    if (currentFirstMeetingOfUsers) {
      return currentFirstMeetingOfUsers;
    }

    let databaseFirstMeetingOfUsers: FirstMeeting | null = null;
    try {
      databaseFirstMeetingOfUsers =
        await this.prismaClientService.firstMeeting.findFirst({
          where: {
            User: { telegramId: telegramUserId.toString() },
          },
          rejectOnNotFound: true,
        });
      this.firstMeetingOfUsers[this.getKey({ telegramUserId })] =
        databaseFirstMeetingOfUsers;

      return this.firstMeetingOfUsers[this.getKey({ telegramUserId })];
    } catch (error) {
      return null;
    }
  }

  async createUserFirstMeeting(telegramUserId: number) {
    return await this.prismaClientService.firstMeeting.create({
      data: {
        firstname: '',
        lastname: '',
        gender: 'Male',
        status: 'StartMeeting',
        User: {
          connectOrCreate: {
            create: { telegramId: telegramUserId.toString() },
            where: { telegramId: telegramUserId.toString() },
          },
        },
      },
    });
  }

  async removeUserFirstMeeting({ telegramUserId }: { telegramUserId: number }) {
    delete this.firstMeetingOfUsers[this.getKey({ telegramUserId })];
    await this.prismaClientService.firstMeeting.deleteMany({
      where: {
        User: { telegramId: telegramUserId.toString() },
      },
    });
  }

  async pathUserFirstMeeting({
    telegramUserId,
    firstMeeting,
  }: {
    telegramUserId: number;
    firstMeeting: Partial<FirstMeeting>;
  }) {
    let currentUserFirstMeeting = await this.getUserFirstMeeting({
      telegramUserId,
    });
    if (!currentUserFirstMeeting) {
      currentUserFirstMeeting = await this.createUserFirstMeeting(
        telegramUserId
      );
    }

    await this.prismaClientService.firstMeeting.updateMany({
      data: {
        ...currentUserFirstMeeting,
        ...firstMeeting,
        updatedAt: new Date(),
      },
      where: {
        User: { telegramId: telegramUserId.toString() },
      },
    });

    delete this.firstMeetingOfUsers[this.getKey({ telegramUserId })];
    this.firstMeetingOfUsers[this.getKey({ telegramUserId })] =
      await this.getUserFirstMeeting({ telegramUserId });
  }

  private getKey({ telegramUserId }: { telegramUserId: number }) {
    return telegramUserId.toString();
  }
}
