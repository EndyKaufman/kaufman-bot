import { СommandToolsService } from '@kaufman-bot/core/server';
import { ScraperService } from '@kaufman-bot/html-scraper/server';
import { Injectable } from '@nestjs/common';
import { FactsGeneratorCommandsEnum } from '../facts-generator-types/facts-generator-commands';

@Injectable()
export class FactsGeneratorService {
  constructor(
    private readonly scraperService: ScraperService,
    private readonly commandToolsService: СommandToolsService
  ) {}

  async onHelp(msg) {
    return await this.scraperService.onMessage({
      ...msg,
      text: `facts ${FactsGeneratorCommandsEnum.help}`,
    });
  }

  async onMessage(msg) {
    const locale = msg.from?.language_code || null;
    if (
      this.commandToolsService.checkCommands(
        msg.text,
        [...Object.keys(FactsGeneratorCommandsEnum)],
        locale
      )
    ) {
      let result = await this.scraperService.onMessage(msg);
      try {
        if (typeof result === 'string' && result !== null) {
          result = result
            .replace('\n\nTweet [http://twitter.com/share]', '')
            .split('\\"')
            .join('"')
            .split('\n')
            .join(' ');
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
