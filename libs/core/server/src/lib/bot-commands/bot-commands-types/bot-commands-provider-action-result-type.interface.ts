import { BotCommandsProviderActionMsg } from './bot-commands-provider-action-msg.interface';

export type BotCommandsProviderActionResultType<T> =
  | {
      type: 'markdown';
      message: T;
      markdown: string;
      context?: Record<string, unknown>;
      recursive?: boolean;
      newState?: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      custom?: any;
      callback?: (
        message: BotCommandsProviderActionMsg,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        botCommandHandlerContext: Record<string, any>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) => Promise<any>;
    }
  | {
      type: 'text';
      message: T;
      text: string;
      context?: Record<string, unknown>;
      recursive?: boolean;
      newState?: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      custom?: any;
      callback?: (
        message: BotCommandsProviderActionMsg,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        botCommandHandlerContext: Record<string, any>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) => Promise<any>;
    }
  | {
      type: 'message';
      message: T;
      context?: Record<string, unknown>;
      recursive?: boolean;
      newState?: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      custom?: any;
      callback?: (
        message: BotCommandsProviderActionMsg,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        botCommandHandlerContext: Record<string, any>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) => Promise<any>;
    }
  | {
      type: 'stop';
      message: T;
      context?: Record<string, unknown>;
      recursive?: boolean;
      newState?: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      custom?: any;
      callback?: (
        message: BotCommandsProviderActionMsg,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        botCommandHandlerContext: Record<string, any>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) => Promise<any>;
    }
  | null;
