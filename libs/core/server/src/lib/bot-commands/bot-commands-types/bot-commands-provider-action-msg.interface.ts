import { Update } from 'telegraf/typings/core/types/typegram';

export type BotCommandsProviderActionMsg<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TLocalContext = Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TGlobalContext = Record<string, any>
> = Update.MessageUpdate['message'] & {
  text: string;
  data: string;
  isStart: boolean;
  botGlobalContext?: TGlobalContext;
  botCommandHandlerId?: string;
  botCommandHandlerBreak: boolean;
  context: TLocalContext;
} & { chat: { id: number } } & {
  message: Update.MessageUpdate['message'];
} & {
  reply_to_message: Update.MessageUpdate['message'];
};
