import { BotCommandsProviderActionResultType } from './bot-commands-provider-action-result-type.interface';
import { BotCommandsProviderActionMsg } from './bot-commands-provider-action-msg.interface';

export interface OnContextBotCommands<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TLocalContext = Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TGlobalContext = Record<string, any>,
  TMethodArgs = BotCommandsProviderActionMsg<TLocalContext, TGlobalContext>
> {
  onContextBotCommands<TMsg extends TMethodArgs = TMethodArgs>(
    msg: TMsg,
    ctx
  ): Promise<BotCommandsProviderActionResultType<TMsg>>;
}
