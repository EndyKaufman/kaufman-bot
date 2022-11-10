import { Message } from 'grammy/out/types.node';

export type BotCommandsProviderActionMsg<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TLocalContext = Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TGlobalContext = Record<string, any>
> = Message &
  Partial<{
    start: boolean;
    handlerId?: string;
    handlerStop: boolean;
    globalContext?: TGlobalContext;
    context: TLocalContext;
    message?: Message;
    callbackQueryData?: string;
  }>;
