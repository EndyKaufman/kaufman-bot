export type BotCommandsProviderActionResultType<T> =
  | { type: 'markdown'; markdown: string }
  | { type: 'text'; text: string }
  | { type: 'message'; message: T }
  | null;
