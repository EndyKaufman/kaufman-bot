import { CommandToolsModule } from '@kaufman-bot/core/server';
import { ScraperModule } from '@kaufman-bot/html-scraper/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesModule } from 'nestjs-translates';
import { FactsGeneratorService } from './facts-generator-services/facts-generator.service';

@Module({
  imports: [TranslatesModule, CommandToolsModule],
  exports: [TranslatesModule, CommandToolsModule],
})
export class FactsGeneratorModule {
  static forRoot(): DynamicModule {
    return {
      module: FactsGeneratorModule,
      imports: [
        ScraperModule.forRoot({
          name: getText('Facts generator'),
          descriptions: getText('Command to generate text with a random fact'),
          usage: [getText('get facts'), getText('facts help')],
          contentSelector: '#z',
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