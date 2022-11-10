import { Message } from 'grammy/out/types.node';
import { BotCommandsContextType } from './bot-commands-context-type.interface';

export type BotCommandsProviderActionMsg<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TLocalContext = BotCommandsContextType['context'],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TGlobalContext = BotCommandsContextType['context']
> = Message &
  Partial<{
    start: boolean;
    handlerId?: string;
    handlerStop: boolean;
    globalContext?: TGlobalContext;
    context?: TLocalContext;
    message?: Message;
    callbackQueryData?: string;
  }>;
