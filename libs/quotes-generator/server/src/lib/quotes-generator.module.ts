import {
  BotCommandsCategory,
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
} from '@kaufman-bot/core-server';
import { ScraperModule } from '@kaufman-bot/html-scraper-server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesModule } from 'nestjs-translates';
import { QuotesGeneratorService } from './quotes-generator-services/quotes-generator.service';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  exports: [TranslatesModule, BotCommandsModule],
})
export class QuotesGeneratorModule {
  static forRoot(): DynamicModule {
    return {
      module: QuotesGeneratorModule,
      imports: [
        ScraperModule.forRoot({
          title: getText('Quotes generator'),
          name: 'quotes',
          descriptions: getText(
            'Command to generate text with a random quotes'
          ),
          usage: [
            getText('get quote'),
            getText('get quotes'),
            getText('quotes help'),
          ],
          contextUsage: [getText('more'), getText('next')],
          contentSelector:
            'forismatic > quote > quotetext, forismatic > quote > quoteauthor',
          spyWords: [getText('quotes'), getText('quote')],
          removeWords: [getText('get'), getText('please')],
          uri: 'https://api.forismatic.com/api/1.0/?method=getQuote&format=xml&lang={{locale}}',
          contentCodepage: 'utf8',
          headers: [{}],
          category: BotCommandsCategory.user,
        }),
      ],
      providers: [
        {
          provide: BOT_COMMANDS_PROVIDER,
          useClass: QuotesGeneratorService,
        },
      ],
      exports: [ScraperModule],
    };
  }
}
