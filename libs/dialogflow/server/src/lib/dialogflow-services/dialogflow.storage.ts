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
  private readonly sessionOfUsers: Record<string, SessionOfUsers> = {};

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
    return null;
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
    const currentSessionOfUsers: SessionOfUsers =
      this.sessionOfUsers[this.getKey({ userId, projectId })] || {};
    currentSessionOfUsers.requestsMetadata = [
      ...(sessionOfUsers?.requestsMetadata || []),
    ];
    currentSessionOfUsers.responsesMetadata = [
      ...(sessionOfUsers.responsesMetadata || []),
    ];

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
      this.sessionOfUsers[this.getKey({ userId, projectId })] = {
        sessionId: 'sessionId',
        requestsMetadata: [],
        responsesMetadata: [],
      };
    } catch (error) {
      null;
    }
  }

  private getKey({ userId, projectId }: { userId: string; projectId: string }) {
    return `${userId}_${projectId}`;
  }
}
