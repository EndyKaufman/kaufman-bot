import { BotCommandsProviderActionResultType } from './bot-commands-provider-action-result-type';
import { BotCommandsProviderActionMsg } from './bot-commands-provider.interface';

export interface OnContextBotCommands {
  onContextBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    msg: TMsg,
    ctx
  ): Promise<BotCommandsProviderActionResultType<TMsg>>;
}
