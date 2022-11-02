import { BotCommandsProviderActionResultType } from '../bot-commands-types/bot-commands-provider-action-result-type.interface';

export const BOT_COMMANDS_STORAGE = Symbol('BOT_COMMANDS_STORAGE');

export interface StorageItem<
  TMessage extends { context?: Record<string, unknown> }
> {
  handlerId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: Record<string, any>;
  response: BotCommandsProviderActionResultType<TMessage>;
  request: BotCommandsProviderActionResultType<TMessage>;
  usedMessageIds: string[];
}

export interface BotCommandsStorageProvider<
  TMessage extends { context?: Record<string, unknown> }
> {
  getStateByUsedMessageId(
    userId: string,
    usedMessageId: string
  ): Promise<StorageItem<TMessage> | null>;
  getState(
    userId: string,
    messageId: string
  ): Promise<StorageItem<TMessage> | null>;
  delState(userId: string, messageId: string): Promise<void>;
  patchState(
    userId: string,
    messageId: string,
    state: Partial<StorageItem<TMessage>>
  ): Promise<void>;
}
