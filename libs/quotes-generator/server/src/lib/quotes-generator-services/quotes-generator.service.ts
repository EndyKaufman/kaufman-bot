import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotСommandsToolsService,
} from '@kaufman-bot/core/server';
import { ScraperService } from '@kaufman-bot/html-scraper/server';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuotesGeneratorService implements BotCommandsProvider {
  constructor(
    private readonly scraperService: ScraperService,
    private readonly botСommandsToolsService: BotСommandsToolsService
  ) {}

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg) {
    return await this.scraperService.onHelp(msg);
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    let locale = msg.from?.language_code;
    if (!locale?.includes('ru') && !locale?.includes('en')) {
      locale = 'en';
    }
    if (
      this.botСommandsToolsService.checkCommands(
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
