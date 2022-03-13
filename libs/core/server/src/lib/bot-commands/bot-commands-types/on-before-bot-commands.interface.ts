import {
  BotCommandsProviderActionContext,
  BotCommandsProviderActionMsg,
} from './bot-commands-provider.interface';

export interface OnBeforeBotCommands {
  onBeforeBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    msg: TMsg,
    ctx?: BotCommandsProviderActionContext
  ): Promise<TMsg>;
}
