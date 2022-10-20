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
  ): Promise<StorageItem | null> {
    const currentState = await this.getState(userId, messageId);

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
    //   name,
    //   userId,
    //   messageId,
    //   messageIds: newMessageIds,
    //   botCommandHandlerId: newState?.botCommandHandlerId,
    // });
    console.log(this.storage);
    return newState;
  }

  private getKey(userId: string, messageId: string) {
    return `${userId}:${messageId}`;
  }
}
