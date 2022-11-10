import { Context } from 'grammy';
import { BotCommandsProviderActionMsg } from './bot-commands-provider-action-msg.interface';

export const BOT_COMMANDS_PROVIDER = 'BOT_COMMANDS_PROVIDER';

export type BotCommandsProviderActionContext = Context;

export interface BotCommandsProvider<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TLocalContext = Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TGlobalContext = Record<string, any>,
  TMethodArgs = BotCommandsProviderActionMsg<TLocalContext, TGlobalContext>
> {
  handlerId: string;

  onHelp<TMsg extends TMethodArgs = TMethodArgs>(
    msg: TMsg,
    ctx: Context
    // todo: fix output types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any>;

  onMessage<TMsg extends TMethodArgs = TMethodArgs>(
    msg: TMsg,
    ctx: Context
    // todo: fix output types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any>;
}
