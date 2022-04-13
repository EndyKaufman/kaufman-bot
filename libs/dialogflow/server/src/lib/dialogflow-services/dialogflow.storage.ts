import { PrismaClientService } from '@kaufman-bot/core/server';
import { Injectable } from '@nestjs/common';
import {
  DialogflowSessionRequestsMetadata,
  DialogflowSessionResponsesMetadata,
} from '../dialogflow-types/dialogflow-session-metadata';

export type SessionOfUsers = {
  sessionId: string;
  responsesMetadata: DialogflowSessionResponsesMetadata;
  requestsMetadata: DialogflowSessionRequestsMetadata;
};

@Injectable()
export class DialogflowStorage {
  private readonly sessionOfUsers: Record<number, SessionOfUsers> = {};

  constructor(private readonly prismaClientService: PrismaClientService) {}

  async getUserSession({
    telegramUserId,
    projectId,
  }: {
    telegramUserId: number;
    projectId: string;
    createIfNotExists?: boolean;
  }): Promise<SessionOfUsers | null> {
    const currentSessionOfUsers: SessionOfUsers =
      this.sessionOfUsers[this.getKey({ telegramUserId, projectId })];
    if (currentSessionOfUsers) {
      return currentSessionOfUsers;
    }
    try {
      const currentFromDatabase =
        await this.prismaClientService.dialogflowSession.findFirst({
          where: {
            User: { telegramId: telegramUserId.toString() },
            projectId,
          },
          rejectOnNotFound: true,
        });
      this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] = {
        sessionId: currentFromDatabase.sessionId,
        requestsMetadata: currentFromDatabase.requestsMetadata,
        responsesMetadata: currentFromDatabase.responsesMetadata,
      };
      return this.sessionOfUsers[this.getKey({ telegramUserId, projectId })];
    } catch (error) {
      return null;
    }
  }

  async appendToUserSession({
    telegramUserId,
    projectId,
    sessionOfUsers,
  }: {
    telegramUserId: number;
    projectId: string;
    sessionOfUsers: SessionOfUsers;
  }): Promise<void> {
    const user = await this.getUser(telegramUserId);

    const currentSessionOfUsers: SessionOfUsers =
      this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] || {};
    currentSessionOfUsers.requestsMetadata = [
      ...(currentSessionOfUsers.requestsMetadata || []),
      ...(sessionOfUsers.requestsMetadata || []),
    ];
    currentSessionOfUsers.responsesMetadata = [
      ...(currentSessionOfUsers.responsesMetadata || []),
      ...sessionOfUsers.responsesMetadata,
    ];

    await this.prismaClientService.dialogflowSession.upsert({
      create: {
        userId: user.id,
        projectId,
        sessionId: sessionOfUsers.sessionId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        requestsMetadata: currentSessionOfUsers.requestsMetadata as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responsesMetadata: currentSessionOfUsers.responsesMetadata as any,
      },
      update: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        requestsMetadata: currentSessionOfUsers.requestsMetadata as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responsesMetadata: currentSessionOfUsers.responsesMetadata as any,
      },
      where: {
        userId_projectId_sessionId: {
          projectId,
          userId: user.id,
          sessionId: sessionOfUsers.sessionId,
        },
      },
    });
    this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] = {
      sessionId: sessionOfUsers.sessionId,
      requestsMetadata: currentSessionOfUsers.requestsMetadata,
      responsesMetadata: currentSessionOfUsers.responsesMetadata,
    };
  }

  private async getUser(telegramUserId: number) {
    let user;
    try {
      user = await this.prismaClientService.user.findFirst({
        select: { id: true },
        where: { telegramId: telegramUserId.toString() },
        rejectOnNotFound: true,
      });
    } catch (error) {
      user = await this.prismaClientService.user.create({
        data: { telegramId: telegramUserId.toString() },
      });
    }
    return user;
  }

  async setUserSession({
    telegramUserId,
    projectId,
    sessionOfUsers,
  }: {
    telegramUserId: number;
    projectId: string;
    sessionOfUsers: SessionOfUsers;
  }): Promise<void> {
    const user = await this.getUser(telegramUserId);

    const currentSessionOfUsers: SessionOfUsers =
      this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] || {};
    currentSessionOfUsers.requestsMetadata = [
      ...(sessionOfUsers?.requestsMetadata || []),
    ];
    currentSessionOfUsers.responsesMetadata = [
      ...(sessionOfUsers.responsesMetadata || []),
    ];

    await this.prismaClientService.dialogflowSession.upsert({
      create: {
        userId: user.id,
        projectId,
        sessionId: sessionOfUsers.sessionId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        requestsMetadata: currentSessionOfUsers.requestsMetadata as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responsesMetadata: currentSessionOfUsers.responsesMetadata as any,
      },
      update: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        requestsMetadata: currentSessionOfUsers.requestsMetadata as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responsesMetadata: currentSessionOfUsers.responsesMetadata as any,
      },
      where: {
        userId_projectId_sessionId: {
          projectId,
          userId: user.id,
          sessionId: sessionOfUsers.sessionId,
        },
      },
    });
    this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] = {
      sessionId: sessionOfUsers.sessionId,
      requestsMetadata: currentSessionOfUsers.requestsMetadata,
      responsesMetadata: currentSessionOfUsers.responsesMetadata,
    };
  }

  async resetUserSession({
    telegramUserId,
    projectId,
  }: {
    telegramUserId: number;
    projectId: string;
  }) {
    try {
      const defaultUserSession =
        await this.prismaClientService.dialogflowSession.findFirst({
          where: {
            User: { telegramId: telegramUserId.toString() },
            projectId,
          },
        });
      if (defaultUserSession) {
        await this.prismaClientService.dialogflowSession.updateMany({
          data: {
            requestsMetadata: [],
            responsesMetadata: [],
          },
          where: {
            sessionId: defaultUserSession.sessionId,
            projectId,
          },
        });
        this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] = {
          sessionId: defaultUserSession.sessionId,
          requestsMetadata: [],
          responsesMetadata: [],
        };
      }
    } catch (error) {
      null;
    }
  }

  private getKey({
    telegramUserId,
    projectId,
  }: {
    telegramUserId: number;
    projectId: string;
  }) {
    return `${telegramUserId}_${projectId}`;
  }
}
