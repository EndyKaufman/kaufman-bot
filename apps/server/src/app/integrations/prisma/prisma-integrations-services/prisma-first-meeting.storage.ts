import {
  FirstMeeting,
  FirstMeetingStorageProvider,
} from '@kaufman-bot/first-meeting-server';
import { PrismaClientService } from '@kaufman-bot/prisma-server';
import { Injectable } from '@nestjs/common';
import { FirstMeetingStatus, Gender } from '@prisma/client';

@Injectable()
export class PrismaFirstMeetingStorage implements FirstMeetingStorageProvider {
  private readonly statesOfUsers: Record<string, FirstMeeting> = {};

  constructor(private readonly prismaClientService: PrismaClientService) {}

  async getState(userId: string): Promise<FirstMeeting | null> {
    const currentStatesOfUsers: FirstMeeting = this.statesOfUsers[userId];
    if (currentStatesOfUsers) {
      return currentStatesOfUsers;
    }

    let databaseStatesOfUsers: FirstMeeting | null = null;
    try {
      databaseStatesOfUsers =
        (await this.prismaClientService.firstMeeting.findFirstOrThrow({
          where: {
            User: { telegramId: userId },
          },
        })) as unknown as FirstMeeting;
      this.statesOfUsers[userId] = databaseStatesOfUsers;

      return this.statesOfUsers[userId];
    } catch (error) {
      return null;
    }
  }

  async clearState(userId: string): Promise<FirstMeeting | null> {
    return (await this.prismaClientService.firstMeeting.create({
      data: {
        firstname: '',
        lastname: '',
        gender: 'Male',
        status: 'StartMeeting',
        User: {
          connectOrCreate: {
            create: { telegramId: userId },
            where: { telegramId: userId },
          },
        },
      },
    })) as unknown as Promise<FirstMeeting>;
  }

  async delState(userId: string) {
    delete this.statesOfUsers[userId];
    await this.prismaClientService.firstMeeting.deleteMany({
      where: {
        User: { telegramId: userId },
      },
    });
  }

  async pathState({
    userId,
    state,
  }: {
    userId: string;
    state: Partial<FirstMeeting>;
  }): Promise<Partial<FirstMeeting> | null> {
    let currentState = await this.getState(userId);
    if (!currentState) {
      currentState = await this.clearState(userId);
    }

    const updatedState = {
      ...currentState,
      ...state,
      messagesMetadata: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(currentState?.messagesMetadata as any),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(state.messagesMetadata as any),
      },
      updatedAt: new Date(),
    };
    await this.prismaClientService.firstMeeting.updateMany({
      data: {
        ...updatedState,
        status: updatedState.status as FirstMeetingStatus,
        gender: updatedState.gender as Gender,
      },
      where: {
        User: { telegramId: userId },
      },
    });

    this.statesOfUsers[userId] = updatedState as FirstMeeting;
    return updatedState;
  }
}
