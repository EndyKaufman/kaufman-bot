import { BotCommandsProviderActionMsg } from './bot-commands-provider-action-msg.interface';

export interface OnBeforeBotCommands {
  onBeforeBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    msg: TMsg,
    ctx?
  ): Promise<TMsg>;
}
