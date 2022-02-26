import { ScraperService } from '@kaufman-bot/html-scraper/server';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FactsGeneratorService {
  constructor(private readonly scraperService: ScraperService) {}

  async onMessage(msg) {
    let result = await this.scraperService.onMessage(msg);
    if (result !== null) {
      result = result.replace('\n\nTweet [http://twitter.com/share]', '');
    }
    return result;
  }
}
