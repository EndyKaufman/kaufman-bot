import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
  OnContextBotCommands,
} from '@kaufman-bot/core-server';
import { ScraperService } from '@kaufman-bot/html-scraper-server';
import { Injectable } from '@nestjs/common';
import { Context } from 'grammy';

const RUSSIAN_LANGUAGE = 'ru';

@Injectable()
export class RuFactsGeneratorService
  implements BotCommandsProvider, OnContextBotCommands
{
  handlerId = RuFactsGeneratorService.name;

  constructor(
    private readonly scraperService: ScraperService,
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}

  async onContextBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    msg: TMsg,
    ctx: Context
  ): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const contextMsg = await this.scraperService.onContextBotCommands(msg);
    return contextMsg ? this.onMessage(contextMsg.message, ctx) : null;
  }

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg, ctx: Context) {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');

    if (!locale?.includes(RUSSIAN_LANGUAGE)) {
      return null;
    }
    return await this.scraperService.onHelp(
      msg,
      ctx,
      RuFactsGeneratorService.name
    );
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    msg: TMsg,
    ctx: Context
  ): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');

    if (!locale?.includes(RUSSIAN_LANGUAGE)) {
      return null;
    }
    if (
      this.botCommandsToolsService.checkCommands(
        msg.text,
        [...Object.keys(BotCommandsEnum)],
        locale
      )
    ) {
      const result = await this.scraperService.onMessage(
        msg,
        ctx,
        RuFactsGeneratorService.name
      );
      try {
        if (result?.type === 'text') {
          return {
            type: 'text',
            message: msg,
            text: result.text.split('\\"').join('"').split('\n').join(' '),
          };
        }
        return result;
      } catch (err) {
        console.debug(result);
        console.error(err, err.stack);
        throw err;
      }
    }
    return null;
  }
}
