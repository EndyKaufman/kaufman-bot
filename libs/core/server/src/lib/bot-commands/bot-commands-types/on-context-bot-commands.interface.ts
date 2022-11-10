import { Context } from 'grammy';
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
    ctx: Context
    // todo: fix output types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any>;
}
