export type BotCommandsProviderActionResultType<T> =
  | {
      type: 'markdown';
      message: T;
      markdown: string;
      context?: Record<string, unknown>;
      recursive?: boolean;
    }
  | {
      type: 'text';
      message: T;
      text: string;
      context?: Record<string, unknown>;
      recursive?: boolean;
    }
  | {
      type: 'message';
      message: T;
      context?: Record<string, unknown>;
      recursive?: boolean;
    }
  | {
      type: 'stop';
      message: T;
      context?: Record<string, unknown>;
      recursive?: boolean;
    }
  | null;
