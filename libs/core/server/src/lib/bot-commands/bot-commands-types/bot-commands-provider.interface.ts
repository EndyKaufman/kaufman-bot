import { Context } from 'grammy';
import { BotCommandsProviderActionMsg } from './bot-commands-provider-action-msg.interface';
import { BotCommandsProviderActionResultType } from './bot-commands-provider-action-result-type.interface';

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
    ctx
  ): Promise<BotCommandsProviderActionResultType<TMsg>>;

  onMessage<TMsg extends TMethodArgs = TMethodArgs>(
    msg: TMsg,
    ctx
  ): Promise<BotCommandsProviderActionResultType<TMsg>>;
}
