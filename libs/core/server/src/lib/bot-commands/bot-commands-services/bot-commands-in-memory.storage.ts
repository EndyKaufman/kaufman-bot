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

  async getStateByUsedMessageId(
    userId: string,
    usedMessageId: string
  ): Promise<StorageItem | null> {
    const messages = Object.keys(this.storage).filter(
      (key) =>
        key.startsWith(`${userId}:`, 0) &&
        this.storage[key]?.usedMessageIds.includes(usedMessageId)
    );
    if (messages.length === 1) {
      return this.storage[messages[0]];
    }
    if (messages.length > 1) {
      throw new Error(
        `Founded ${messages.length} states with usedMessageId = ${usedMessageId}`
      );
    }
    return null;
  }

  async getState(
    userId: string,
    messageId: string
  ): Promise<StorageItem | null> {
    return this.storage[this.getKey(userId, messageId)] || null;
  }

  async delState(userId: string, messageId: string): Promise<void> {
    this.storage[this.getKey(userId, messageId)] = null;
  }

  async patchState(
    userId: string,
    messageId: string,
    state: Partial<StorageItem>
  ): Promise<void> {
    const currentState = await this.getState(userId, messageId);

    const usedMessageIds = [
      ...new Set(
        [
          ...(currentState?.usedMessageIds || []),
          ...(state.usedMessageIds || []),
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
      usedMessageIds,
    } as StorageItem;
    // console.log(this.storage);
  }

  private getKey(userId: string, messageId: string) {
    return `${userId}:${messageId}`;
  }
}
