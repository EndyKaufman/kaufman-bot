import { BotCommandsProviderActionResultType } from './bot-commands-provider-action-result-type.interface';
import { BotCommandsProviderActionMsg } from './bot-commands-provider-action-msg.interface';

export interface OnAfterBotCommands {
  onAfterBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    result: BotCommandsProviderActionResultType<TMsg>,
    msg: TMsg,
    ctx?,
    defaultHandler?: () => Promise<unknown>
  ): Promise<{ result: BotCommandsProviderActionResultType<TMsg>; msg: TMsg }>;
}
