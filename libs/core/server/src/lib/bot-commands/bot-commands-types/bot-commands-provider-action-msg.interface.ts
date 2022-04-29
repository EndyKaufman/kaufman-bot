import { Update } from 'telegraf/typings/core/types/typegram';

export type BotCommandsProviderActionMsg = Update.MessageUpdate['message'] & {
  text: string;
  data: string;
  botStart: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  botContext?: Record<string, any>;
  botCommandHandlerId: string | null;
  botCommandHandlerBreak: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  botCommandHandlerContext: Record<string, any>;
} & { chat: { id: number } };
