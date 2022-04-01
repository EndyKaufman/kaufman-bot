import { Injectable } from '@nestjs/common';
import { CustomInject } from 'nestjs-custom-injector';
import { BotCommandsEnum } from '../bot-commands-types/bot-commands-enum';
import { BotCommandsProviderActionResultType } from '../bot-commands-types/bot-commands-provider-action-result-type';
import {
  BotCommandsProvider,
  BotCommandsProviderActionContext,
  BotCommandsProviderActionMsg,
  BOT_COMMANDS_PROVIDER,
} from '../bot-commands-types/bot-commands-provider.interface';
import { OnAfterBotCommands } from '../bot-commands-types/on-after-bot-commands.interface';
import { OnBeforeBotCommands } from '../bot-commands-types/on-before-bot-commands.interface';
import { BotСommandsToolsService } from './bot-commands-tools.service';
@Injectable()
export class BotСommandsService implements BotCommandsProvider {
  @CustomInject(BOT_COMMANDS_PROVIDER, { multi: true })
  private botCommandsProviders!: (BotCommandsProvider &
    Partial<OnBeforeBotCommands> &
    Partial<OnAfterBotCommands>)[];

  constructor(
    private readonly botСommandsToolsService: BotСommandsToolsService
  ) {}

  async process(ctx, defaultHandler?: () => Promise<unknown>) {
    let msg: BotCommandsProviderActionMsg = ctx.update.message;
    const result = await this.onMessage(msg, ctx, defaultHandler);
    if (result?.type === 'message') {
      msg = result.message;
    }
    if (result?.type === 'markdown') {
      await ctx.reply(result.markdown, { parse_mode: 'MarkdownV2' });
      return;
    }
    if (result?.type === 'text') {
      await ctx.reply(result.text);
      return;
    }
  }

  async onHelp<TMsg extends BotCommandsProviderActionMsg>(
    msg: TMsg,
    ctx: BotCommandsProviderActionContext
  ): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const allResults: string[] = [];
    const len = this.botCommandsProviders.length;
    for (let i = 0; i < len; i++) {
      const botCommandsProvider = this.botCommandsProviders[i];

      const result = await botCommandsProvider.onHelp(msg, ctx);

      if (result !== null && result.type === 'text') {
        allResults.push(result.text);
      }

      if (result !== null && result.type === 'markdown') {
        allResults.push(result.markdown);
      }
    }
    return {
      type: 'markdown',
      markdown: allResults.join('\n\n'),
    };
  }

  async onMessage<TMsg extends BotCommandsProviderActionMsg>(
    msg: TMsg,
    ctx: BotCommandsProviderActionContext,
    defaultHandler?: () => Promise<unknown>
  ): Promise<BotCommandsProviderActionResultType<TMsg>> {
    msg = await this.processOnBeforeBotCommands(msg, ctx);

    const len = this.botCommandsProviders.length;
    let result: BotCommandsProviderActionResultType<TMsg> = null;
    for (let i = 0; i < len; i++) {
      if (!result) {
        const botCommandsProvider = this.botCommandsProviders[i];

        result = await botCommandsProvider.onMessage(msg, ctx);
      }
    }

    if (
      result === null &&
      this.botСommandsToolsService.checkCommands(
        msg.text,
        [BotCommandsEnum.help],
        msg.from.language_code
      )
    ) {
      return this.onHelp(msg, ctx);
    }

    const afterBotCommand = await this.processOnAfterBotCommands(
      result,
      msg,
      ctx
    );

    if (defaultHandler) {
      await defaultHandler();
    }

    return afterBotCommand.result;
  }

  async processOnBeforeBotCommands<TMsg extends BotCommandsProviderActionMsg>(
    msg: TMsg,
    ctx?: BotCommandsProviderActionContext
  ): Promise<TMsg> {
    const len = this.botCommandsProviders.length;
    for (let i = 0; i < len; i++) {
      const botCommandsProvider = this.botCommandsProviders[i];
      if (botCommandsProvider.onBeforeBotCommands)
        msg = await botCommandsProvider.onBeforeBotCommands(msg, ctx);
    }
    return msg;
  }

  async processOnAfterBotCommands<
    TMsg extends BotCommandsProviderActionMsg,
    TResult extends BotCommandsProviderActionResultType<TMsg> = BotCommandsProviderActionResultType<TMsg>
  >(
    result: TResult,
    msg: TMsg,
    ctx?: BotCommandsProviderActionContext
  ): Promise<{ result: TResult; msg: TMsg }> {
    const len = this.botCommandsProviders.length;
    for (let i = 0; i < len; i++) {
      const botCommandsProvider = this.botCommandsProviders[i];
      if (botCommandsProvider.onAfterBotCommands) {
        const afterBotCommand = await botCommandsProvider.onAfterBotCommands<
          TMsg,
          TResult
        >(result, msg, ctx);
        result = afterBotCommand.result;
        msg = afterBotCommand.msg;
      }
    }
    return { result, msg };
  }
}
