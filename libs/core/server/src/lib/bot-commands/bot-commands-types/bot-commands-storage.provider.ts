import { BotCommandsProviderActionResultType } from '../bot-commands-types/bot-commands-provider-action-result-type.interface';

export const BOT_COMMANDS_STORAGE = Symbol('BOT_COMMANDS_STORAGE');

export interface StorageItem {
  botCommandHandlerId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  botCommandHandlerContext?: Record<string, any>;
  response: BotCommandsProviderActionResultType<unknown>;
  request: BotCommandsProviderActionResultType<unknown>;
  usedMessageIds: string[];
}

export interface BotCommandsStorageProvider {
  getStateByUsedMessageId(
    userId: string,
    usedMessageId: string
  ): Promise<StorageItem | null>;
  getState(userId: string, messageId: string): Promise<StorageItem | null>;
  delState(userId: string, messageId: string): Promise<void>;
  patchState(
    userId: string,
    messageId: string,
    state: Partial<StorageItem>
  ): Promise<void>;
}
