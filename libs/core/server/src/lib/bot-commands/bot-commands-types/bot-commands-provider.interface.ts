import { Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { BotCommandsProviderActionMsg } from './bot-commands-provider-action-msg.interface';
import { BotCommandsProviderActionResultType } from './bot-commands-provider-action-result-type.interface';

export const BOT_COMMANDS_PROVIDER = Symbol('BOT_COMMANDS_PROVIDER');

export type BotCommandsProviderActionContext = Context<Update.MessageUpdate>;

export interface BotCommandsProvider {
  botCommandHandlerId: string;

  onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    msg: TMsg,
    ctx
  ): Promise<BotCommandsProviderActionResultType<TMsg>>;

  onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    msg: TMsg,
    ctx
  ): Promise<BotCommandsProviderActionResultType<TMsg>>;
}
