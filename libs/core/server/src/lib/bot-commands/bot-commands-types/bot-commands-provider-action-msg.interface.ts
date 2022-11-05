import { Update } from 'telegraf/typings/core/types/typegram';

export type BotCommandsProviderActionMsg<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TLocalContext = Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TGlobalContext = Record<string, any>
> = Update.MessageUpdate['message'] & {
  start: boolean;
  text: string;
  data: string;
  handlerId?: string;
  handlerStop: boolean;
  globalContext?: TGlobalContext;
  context: TLocalContext;
  contact: {
    phone_number: string;
    first_name: string;
    user_id: number;
  };
} & { chat: { id: number } } & {
  message: Update.MessageUpdate['message'];
} & {
  reply_to_message: Update.MessageUpdate['message'];
};
