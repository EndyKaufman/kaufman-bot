import { BotCommandsContextType } from './bot-commands-context-type.interface';
import { BotCommandsProviderActionMsg } from './bot-commands-provider-action-msg.interface';

export type BotCommandsProviderActionResultType<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TMessage extends BotCommandsContextType
> =
  | {
      type: 'markdown';
      message: TMessage;
      markdown: string;
      context?: TMessage['context'];
      recursive?: boolean;
      newState?: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      custom?: any;
      callback?: (
        message: BotCommandsProviderActionMsg,
        context: TMessage['context']
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) => Promise<any>;
    }
  | {
      type: 'text';
      message: TMessage;
      text: string;
      context?: TMessage['context'];
      recursive?: boolean;
      newState?: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      custom?: any;
      callback?: (
        message: BotCommandsProviderActionMsg,
        context: TMessage['context']
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) => Promise<any>;
    }
  | {
      type: 'message';
      message: TMessage;
      context?: TMessage['context'];
      recursive?: boolean;
      newState?: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      custom?: any;
      callback?: (
        message: BotCommandsProviderActionMsg,
        context: TMessage['context']
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) => Promise<any>;
    }
  | {
      type: 'stop';
      message: TMessage;
      context?: TMessage['context'];
      recursive?: boolean;
      newState?: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      custom?: any;
      callback?: (
        message: BotCommandsProviderActionMsg,
        context: TMessage['context']
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) => Promise<any>;
    }
  | null;
