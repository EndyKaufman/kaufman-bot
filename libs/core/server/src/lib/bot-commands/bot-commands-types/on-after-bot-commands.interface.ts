import { BotCommandsProviderActionResultType } from './bot-commands-provider-action-result-type';
import {
  BotCommandsProviderActionContext,
  BotCommandsProviderActionMsg,
} from './bot-commands-provider.interface';

export interface OnAfterBotCommands {
  onAfterBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg,
    TResult extends BotCommandsProviderActionResultType<TMsg> = BotCommandsProviderActionResultType<TMsg>
  >(
    result: TResult,
    msg: TMsg,
    ctx?: BotCommandsProviderActionContext
  ): Promise<{ result: TResult; msg: TMsg }>;
}
