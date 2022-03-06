import {
  ScraperCommandsEnum,
  ScraperService,
} from '@kaufman-bot/html-scraper/server';
import { Injectable } from '@nestjs/common';
@Injectable()
export class CurrencyConverterService {
  constructor(private readonly scraperService: ScraperService) {}

  async onHelp(msg) {
    return await this.scraperService.onMessage({
      ...msg,
      text: `convert ${ScraperCommandsEnum.help}`,
    });
  }

  async onMessage(msg) {
    const result = await this.scraperService.onMessage(msg);
    if (
      result &&
      typeof result === 'string' &&
      /^[.,0-9]+$/.test(result.split(' ')[0])
    ) {
      return result.split(' ')[0];
    }
    return result;
  }
}
