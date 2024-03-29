import {
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
} from '@kaufman-bot/core-server';
import { ScraperService } from '@kaufman-bot/html-scraper-server';
import { Injectable } from '@nestjs/common';
import { Context } from 'grammy';
@Injectable()
export class CurrencyConverterService implements BotCommandsProvider {
  handlerId = CurrencyConverterService.name;

  constructor(private readonly scraperService: ScraperService) {}

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg, ctx: Context) {
    return await this.scraperService.onHelp(
      msg,
      ctx,
      CurrencyConverterService.name
    );
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    msg: TMsg,
    ctx: Context
  ): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const result = await this.scraperService.onMessage(
      msg,
      ctx,
      CurrencyConverterService.name
    );
    if (
      result?.type === 'text' &&
      /^[.,0-9]+$/.test(result.text.split(' ')[0])
    ) {
      return {
        type: 'text',
        message: msg,
        text: result.text.split(' ')[0],
      };
    }
    return result;
  }
}
