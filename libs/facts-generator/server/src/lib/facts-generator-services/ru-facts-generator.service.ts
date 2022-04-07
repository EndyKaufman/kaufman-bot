import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotСommandsToolsService,
} from '@kaufman-bot/core/server';
import { ScraperService } from '@kaufman-bot/html-scraper/server';
import { Injectable } from '@nestjs/common';

const RUSSIAN_LANGUAGE = 'ru';

@Injectable()
export class RuFactsGeneratorService implements BotCommandsProvider {
  constructor(
    private readonly scraperService: ScraperService,
    private readonly botСommandsToolsService: BotСommandsToolsService
  ) {}

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg) {
    const locale = msg.from?.language_code;
    if (!locale?.includes(RUSSIAN_LANGUAGE)) {
      return null;
    }
    return await this.scraperService.onHelp(msg);
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale = msg.from?.language_code;
    if (!locale?.includes(RUSSIAN_LANGUAGE)) {
      return null;
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
