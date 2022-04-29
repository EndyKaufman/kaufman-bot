import { BotCommandsProviderActionResultType } from './bot-commands-provider-action-result-type.interface';
import { BotCommandsProviderActionMsg } from './bot-commands-provider-action-msg.interface';

export interface OnContextBotCommands {
  onContextBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    msg: TMsg,
    ctx
  ): Promise<BotCommandsProviderActionResultType<TMsg>>;
}
