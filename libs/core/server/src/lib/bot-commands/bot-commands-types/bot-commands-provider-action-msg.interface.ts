import { Update } from 'telegraf/typings/core/types/typegram';

export type BotCommandsProviderActionMsg = Update.MessageUpdate['message'] & {
  text: string;
  data: string;
  botStart: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  botGlobalContext?: Record<string, any>;
  botCommandHandlerId: string | null;
  botCommandHandlerBreak: boolean;
  botCommandHandlerClearState: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  botCommandHandlerContext: Record<string, any>;
} & { chat: { id: number } } & { message: Update.MessageUpdate['message'] } & {
  reply_to_message: Update.MessageUpdate['message'];
};
