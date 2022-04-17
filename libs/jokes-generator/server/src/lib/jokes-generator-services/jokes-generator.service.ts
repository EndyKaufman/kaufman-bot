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

@Injectable()
export class JokesGeneratorService
  implements BotCommandsProvider, OnContextBotCommands
{
  constructor(
    private readonly scraperService: ScraperService,
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}

  async onContextBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const contextMsg = await this.scraperService.onContextBotCommands(msg);
    return contextMsg ? this.onMessage(contextMsg.message) : null;
  }

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg) {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    if (!locale?.includes('en')) {
      return null;
    }
    return await this.scraperService.onHelp(msg);
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    if (!locale?.includes('en')) {
      return null;
    }
    if (
      this.botCommandsToolsService.checkCommands(
        msg.text,
        [...Object.keys(BotCommandsEnum)],
        locale
      )
    ) {
      const result = await this.scraperService.onMessage(msg);
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
