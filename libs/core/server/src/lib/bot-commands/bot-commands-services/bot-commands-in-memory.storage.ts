import { Injectable } from '@nestjs/common';
import { LATEST_MESSAGE_ID } from '../bot-commands-constants/bot-commands.constants';
import {
  BotCommandsStorageProvider,
  StorageItem,
} from '../bot-commands-types/bot-commands-storage.provider';
import { BotCommandsToolsService } from './bot-commands-tools.service';

@Injectable()
export class BotCommandsInMemoryStorage<
  TMessage extends { context?: Record<string, unknown> }
> implements BotCommandsStorageProvider<TMessage>
{
  private readonly storage: Record<string, StorageItem<TMessage> | null> = {};

  constructor(
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}

  async changeMessageId(
    userId: string,
    oldMessageId: string,
    newMessageId: string
  ): Promise<void> {
    Object.keys(this.storage).forEach((key) => {
      if (this.storage[key]?.usedMessageIds.includes(oldMessageId)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.storage[key]!.usedMessageIds = (
          this.storage[key]?.usedMessageIds || []
        ).map((usedMessageId) =>
          usedMessageId === oldMessageId ? newMessageId : usedMessageId
        );
      }
      if (key.startsWith(`${userId}:${oldMessageId}`, 0)) {
        this.storage[`${userId}:${newMessageId}`] = this.storage[key];
        delete this.storage[key];
      }
    });
  }

  async getStateByUsedMessageId(
    userId: string,
    usedMessageId: string
  ): Promise<StorageItem<TMessage> | null> {
    const messages = Object.keys(this.storage).filter(
      (key) =>
        key.startsWith(`${userId}:`, 0) &&
        !key.startsWith(`${userId}:${LATEST_MESSAGE_ID}`, 0) &&
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
  ): Promise<StorageItem<TMessage> | null> {
    return this.storage[this.getKey(userId, messageId)] || null;
  }

  async delState(userId: string, messageId: string): Promise<void> {
    this.storage[this.getKey(userId, messageId)] = null;
  }

  async patchState(
    userId: string,
    messageId: string,
    state: Partial<StorageItem<TMessage>>
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
      context: {
        ...(currentState?.context || {}),
        ...(state?.context || {}),
      },
      usedMessageIds,
    } as StorageItem<TMessage>;
    // console.log(this.storage);
  }

  private getKey(userId: string, messageId: string) {
    return `${userId}:${messageId}`;
  }
}
