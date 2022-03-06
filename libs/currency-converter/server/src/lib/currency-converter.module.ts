import { ScraperModule } from '@kaufman-bot/html-scraper/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CurrencyConverterService } from './currency-converter-services/currency-converter.service';

@Module({})
export class CurrencyConverterModule {
  static forRoot(): DynamicModule {
    return {
      module: CurrencyConverterModule,
      imports: [
        ScraperModule.forRoot({
          name: getText('Currency converter'),
          descriptions: getText('Command to convert one currency to another'),
          usage: [getText('convert 1 usd to eur'), getText('converter help')],
          contentSelector:
            '#__next > div:nth-child(2) > div.fluid-container__BaseFluidContainer-qoidzu-0.gJBOzk > section > div:nth-child(2) > div > main > form > div:nth-child(2) > div:nth-child(1) > p.result__BigRate-sc-1bsijpp-1.iGrAod',
          spyWords: [getText('convert'), getText('converter')],
          removeWords: [getText('to'), getText('please')],
          uri: 'https://www.xe.com/currencyconverter/convert/?Amount={{TEXT1}}&From={{TEXT2}}&To={{TEXT3}}',
        }),
      ],
      providers: [CurrencyConverterService],
      exports: [ScraperModule, CurrencyConverterService],
    };
  }
}
