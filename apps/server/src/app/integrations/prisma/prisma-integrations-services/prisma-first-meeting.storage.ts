import {
  FirstMeeting,
  FirstMeetingStorageProvider,
} from '@kaufman-bot/first-meeting-server';
import { PrismaClientService } from '@kaufman-bot/prisma-server';
import { Injectable } from '@nestjs/common';
import { FirstMeetingStatus, Gender } from '@prisma/client';

@Injectable()
export class PrismaFirstMeetingStorage implements FirstMeetingStorageProvider {
  private readonly statesOfUsers: Record<number, FirstMeeting> = {};

  constructor(private readonly prismaClientService: PrismaClientService) {}

  async getState({
    telegramUserId,
  }: {
    telegramUserId: number;
  }): Promise<FirstMeeting | null> {
    const currentStatesOfUsers: FirstMeeting =
      this.statesOfUsers[telegramUserId.toString()];
    if (currentStatesOfUsers) {
      return currentStatesOfUsers;
    }

    let databaseStatesOfUsers: FirstMeeting | null = null;
    try {
      databaseStatesOfUsers =
        (await this.prismaClientService.firstMeeting.findFirst({
          where: {
            User: { telegramId: telegramUserId.toString() },
          },
          rejectOnNotFound: true,
        })) as unknown as FirstMeeting;
      this.statesOfUsers[telegramUserId.toString()] = databaseStatesOfUsers;

      return this.statesOfUsers[telegramUserId.toString()];
    } catch (error) {
      return null;
    }
  }

  async clearState(telegramUserId: number): Promise<FirstMeeting | null> {
    return (await this.prismaClientService.firstMeeting.create({
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
    })) as unknown as Promise<FirstMeeting>;
  }

  async delState({ telegramUserId }: { telegramUserId: number }) {
    delete this.statesOfUsers[telegramUserId.toString()];
    await this.prismaClientService.firstMeeting.deleteMany({
      where: {
        User: { telegramId: telegramUserId.toString() },
      },
    });
  }

  async pathState({
    telegramUserId,
    state,
  }: {
    telegramUserId: number;
    state: Partial<FirstMeeting>;
  }): Promise<Partial<FirstMeeting> | null> {
    let currentState = await this.getState({
      telegramUserId,
    });
    if (!currentState) {
      currentState = await this.clearState(telegramUserId);
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
        User: { telegramId: telegramUserId.toString() },
      },
    });

    this.statesOfUsers[telegramUserId.toString()] = updatedState;
    return updatedState;
  }
}
