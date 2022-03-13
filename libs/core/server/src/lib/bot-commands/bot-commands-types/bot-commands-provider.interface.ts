import { Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { BotCommandsProviderActionResultType } from './bot-commands-provider-action-result-type';

export const BOT_COMMANDS_PROVIDER = Symbol('BOT_COMMANDS_PROVIDER');

export type BotCommandsProviderActionMsg = Update.MessageUpdate['message'] & {
  text: string;
};

export type BotCommandsProviderActionContext = Context<Update.MessageUpdate>;

export interface BotCommandsProvider {
  onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    msg: TMsg,
    ctx?: BotCommandsProviderActionContext
  ): Promise<BotCommandsProviderActionResultType<TMsg>>;

  onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    msg: TMsg,
    ctx?: BotCommandsProviderActionContext
  ): Promise<BotCommandsProviderActionResultType<TMsg>>;
}
