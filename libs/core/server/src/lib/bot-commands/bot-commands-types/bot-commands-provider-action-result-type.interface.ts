import { BotCommandsProviderActionMsg } from './bot-commands-provider-action-msg.interface';

export type BotCommandsProviderActionResultType<T> =
  | {
      type: 'markdown';
      message: T;
      markdown: string;
      context?: Record<string, unknown>;
      recursive?: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      custom?: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback?: (message: BotCommandsProviderActionMsg) => Promise<any>;
    }
  | {
      type: 'text';
      message: T;
      text: string;
      context?: Record<string, unknown>;
      recursive?: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      custom?: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback?: (message: BotCommandsProviderActionMsg) => Promise<any>;
    }
  | {
      type: 'message';
      message: T;
      context?: Record<string, unknown>;
      recursive?: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      custom?: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback?: (message: BotCommandsProviderActionMsg) => Promise<any>;
    }
  | {
      type: 'stop';
      message: T;
      context?: Record<string, unknown>;
      recursive?: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      custom?: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback?: (message: BotCommandsProviderActionMsg) => Promise<any>;
    }
  | null;
