import { BotCommandsProviderActionResultType } from './bot-commands-provider-action-result-type.interface';
import { BotCommandsProviderActionMsg } from './bot-commands-provider-action-msg.interface';
import { Context } from 'grammy';

export interface OnAfterBotCommands {
  onAfterBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    result: BotCommandsProviderActionResultType<TMsg>,
    msg: TMsg,
    ctx?: Context,
    defaultHandler?: () => Promise<unknown>
  ): Promise<{ result: BotCommandsProviderActionResultType<TMsg>; msg: TMsg }>;
}
