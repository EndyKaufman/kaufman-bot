import { ScraperModule } from '@kaufman-bot/html-scraper/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { FactsGeneratorService } from './facts-generator-services/facts-generator.service';

@Module({})
export class FactsGeneratorModule {
  static forRoot(): DynamicModule {
    return {
      module: FactsGeneratorModule,
      imports: [
        ScraperModule.forRoot({
          contentSelector: '#z',
          help: getText('Random facts generator'),
          spyWords: [getText('facts')],
          removeWords: [getText('get'), getText('please')],
          uri: 'http://randomfactgenerator.net/',
        }),
      ],
      providers: [FactsGeneratorService],
      exports: [ScraperModule, FactsGeneratorService],
    };
  }
}
