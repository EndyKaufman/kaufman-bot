import { BotCommandsToolsGenerateHelpMessageOptions } from './bot-commands-tools-types.interface';

export const BOT_COMMANDS_TOOLS_INTERCEPTOR = 'BOT_COMMANDS_TOOLS_INTERCEPTOR';

export interface BotCommandsToolsInterceptor {
  interceptHelpMessageOptions: (
    options: BotCommandsToolsGenerateHelpMessageOptions
  ) => BotCommandsToolsGenerateHelpMessageOptions;
}
