import {
  DialogflowSessionRequestsMetadata,
  DialogflowSessionResponsesMetadata,
  DialogflowStorageProvider,
  SessionOfUsers,
} from '@kaufman-bot/dialogflow-server';
import { PrismaClientService } from '@kaufman-bot/prisma-server';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaDialogflowStorage implements DialogflowStorageProvider {
  private readonly sessionOfUsers: Record<string, SessionOfUsers> = {};

  constructor(private readonly prismaClientService: PrismaClientService) {}

  async getUserSession({
    userId,
    projectId,
  }: {
    userId: string;
    projectId: string;
    createIfNotExists?: boolean;
  }): Promise<SessionOfUsers | null> {
    const currentSessionOfUsers: SessionOfUsers =
      this.sessionOfUsers[this.getKey({ userId, projectId })];
    if (currentSessionOfUsers) {
      return currentSessionOfUsers;
    }
    try {
      const currentFromDatabase =
        await this.prismaClientService.dialogflowSession.findFirstOrThrow({
          where: {
            User: { telegramId: userId },
            projectId,
          },
        });
      this.sessionOfUsers[this.getKey({ userId, projectId })] = {
        sessionId: currentFromDatabase.sessionId,
        requestsMetadata:
          currentFromDatabase.requestsMetadata as unknown as DialogflowSessionRequestsMetadata,
        responsesMetadata:
          currentFromDatabase.responsesMetadata as unknown as DialogflowSessionResponsesMetadata,
      };
      return this.sessionOfUsers[this.getKey({ userId, projectId })];
    } catch (error) {
      return null;
    }
  }

  async appendToUserSession({
    userId,
    projectId,
    sessionOfUsers,
  }: {
    userId: string;
    projectId: string;
    sessionOfUsers: SessionOfUsers;
  }): Promise<void> {
    const user = await this.getUser(userId);

    const currentSessionOfUsers: SessionOfUsers =
      this.sessionOfUsers[this.getKey({ userId, projectId })] || {};
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
    this.sessionOfUsers[this.getKey({ userId, projectId })] = {
      sessionId: sessionOfUsers.sessionId,
      requestsMetadata: currentSessionOfUsers.requestsMetadata,
      responsesMetadata: currentSessionOfUsers.responsesMetadata,
    };
  }

  async setUserSession({
    userId,
    projectId,
    sessionOfUsers,
  }: {
    userId: string;
    projectId: string;
    sessionOfUsers: SessionOfUsers;
  }): Promise<void> {
    const user = await this.getUser(userId);

    const currentSessionOfUsers: SessionOfUsers =
      this.sessionOfUsers[this.getKey({ userId, projectId })] || {};
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
    this.sessionOfUsers[this.getKey({ userId, projectId })] = {
      sessionId: sessionOfUsers.sessionId,
      requestsMetadata: currentSessionOfUsers.requestsMetadata,
      responsesMetadata: currentSessionOfUsers.responsesMetadata,
    };
  }

  async resetUserSession({
    userId,
    projectId,
  }: {
    userId: string;
    projectId: string;
  }) {
    try {
      const defaultUserSession =
        await this.prismaClientService.dialogflowSession.findFirst({
          where: {
            User: { telegramId: userId },
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
        this.sessionOfUsers[this.getKey({ userId, projectId })] = {
          sessionId: defaultUserSession.sessionId,
          requestsMetadata: [],
          responsesMetadata: [],
        };
      }
    } catch (error) {
      null;
    }
  }

  private async getUser(userId: string) {
    let user;
    try {
      user = await this.prismaClientService.user.findFirstOrThrow({
        select: { id: true },
        where: { telegramId: userId },
      });
    } catch (error) {
      user = await this.prismaClientService.user.create({
        data: { telegramId: userId },
      });
    }
    return user;
  }

  private getKey({ userId, projectId }: { userId: string; projectId: string }) {
    return `${userId}_${projectId}`;
  }
}
