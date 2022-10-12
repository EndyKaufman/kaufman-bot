import { Injectable } from '@nestjs/common';
import {
  BotCommandsStorageProvider,
  StorageItem,
} from '../bot-commands-types/bot-commands-storage.provider';
import { BotCommandsToolsService } from './bot-commands-tools.service';

@Injectable()
export class BotCommandsInMemoryStorage implements BotCommandsStorageProvider {
  private readonly storage: Record<string, StorageItem | null> = {};

  constructor(
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}

  async setLatestStateByChildMessageId(messageId: string): Promise<void> {
    const messages = Object.keys(this.storage).filter((key) =>
      this.storage[key]?.messageIds.includes(messageId)
    );
    if (messages.length > 0) {
      const context =
        messages.reduce(
          (all: StorageItem['botCommandHandlerContext'], cur: string) => ({
            ...all,
            ...(this.storage[cur]?.botCommandHandlerContext || {}),
          }),
          {}
        ) || {};
      const state = messages[0] && this.storage[messages[0]];
      const [userId] = messages[0].split(':');
      this.patchState(userId, 'latest', {
        ...state,
        botCommandHandlerContext: context,
      });
    }
  }

  async getState(
    userId: string,
    messageId: string
  ): Promise<StorageItem | null> {
    return this.storage[this.getKey(userId, messageId)] || null;
  }

  async delState(userId: string, messageId: string): Promise<void> {
    const currentState = await this.getState(userId, messageId);

    const messageIds = (currentState?.messageIds || []).filter(
      (v) => v !== messageId
    );
    if (messageIds[0]) {
      await this.patchState(userId, messageIds[0], {
        ...(currentState || {}),

        botCommandHandlerId: currentState?.botCommandHandlerId,
      });
    }

    this.storage[this.getKey(userId, messageId)] = null;
  }

  async patchState(
    userId: string,
    messageId: string,
    state: Partial<StorageItem>
  ): Promise<StorageItem | null> {
    const currentState = await this.getState(userId, messageId);
    if (
      currentState?.botCommandHandlerId &&
      currentState?.botCommandHandlerId !== state.botCommandHandlerId
    ) {
      const messageIds = (currentState?.messageIds || []).filter(
        (v) => v !== messageId
      );
      await this.patchState(userId, messageIds[0], {
        ...(currentState || {}),

        botCommandHandlerId: currentState?.botCommandHandlerId,
      });
      state.messageIds = [];
      state.botCommandHandlerContext = {};
    }
    const messageIds = [
      ...new Set(
        [
          ...(currentState?.messageIds || []),
          ...(state.messageIds || []),
          state.request
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              this.botCommandsToolsService.getReplyMessageId<any>(
                state.request.message
              )
            : undefined,
          state.response
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              this.botCommandsToolsService.getReplyMessageId<any>(
                state.response.message
              )
            : undefined,
          state.request
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              this.botCommandsToolsService.getReplyMessageId<any>(state.request)
            : undefined,
          state.response
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              this.botCommandsToolsService.getReplyMessageId<any>(
                state.response
              )
            : undefined,
        ].filter(Boolean)
      ),
    ];
    this.storage[this.getKey(userId, messageId)] = {
      ...state,
      botCommandHandlerContext: {
        ...(currentState?.botCommandHandlerContext || {}),
        ...(state?.botCommandHandlerContext || {}),
      },
      messageIds,
    } as StorageItem;
    const newState = await this.getState(userId, messageId);
    // console.log({
    //   userId,
    //   messageId,
    //   messageIds,
    //   botCommandHandlerId: newState?.botCommandHandlerId,
    // });
    return newState;
  }

  private getKey(userId: string, messageId: string) {
    return `${userId}:${messageId}`;
  }
}
