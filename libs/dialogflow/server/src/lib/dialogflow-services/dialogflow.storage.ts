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
export const DIALOGFLOW_STORAGE = 'DIALOGFLOW_STORAGE';

export type DialogflowStorageProvider = Pick<
  DialogflowStorage,
  | 'getUserSession'
  | 'appendToUserSession'
  | 'resetUserSession'
  | 'setUserSession'
>;

@Injectable()
export class DialogflowStorage {
  private readonly sessionOfUsers: Record<number, SessionOfUsers> = {};

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
    return null;
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

    this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] = {
      sessionId: sessionOfUsers.sessionId,
      requestsMetadata: currentSessionOfUsers.requestsMetadata,
      responsesMetadata: currentSessionOfUsers.responsesMetadata,
    };
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
    const currentSessionOfUsers: SessionOfUsers =
      this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] || {};
    currentSessionOfUsers.requestsMetadata = [
      ...(sessionOfUsers?.requestsMetadata || []),
    ];
    currentSessionOfUsers.responsesMetadata = [
      ...(sessionOfUsers.responsesMetadata || []),
    ];

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
      this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] = {
        sessionId: 'sessionId',
        requestsMetadata: [],
        responsesMetadata: [],
      };
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
