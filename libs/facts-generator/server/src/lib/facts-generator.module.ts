import {
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
} from '@kaufman-bot/core/server';
import { ScraperModule } from '@kaufman-bot/html-scraper/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { TranslatesModule } from 'nestjs-translates';
import { FactsGeneratorService } from './facts-generator-services/facts-generator.service';
import { RuFactsGeneratorService } from './facts-generator-services/ru-facts-generator.service';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  exports: [TranslatesModule, BotCommandsModule],
})
export class FactsGeneratorModule {
  static forRoot(): DynamicModule {
    return {
      module: FactsGeneratorModule,
      imports: [
        CustomInjectorModule.forFeature({
          imports: [
            ScraperModule.forRoot({
              name: getText('Facts generator'),
              descriptions: getText(
                'Command to generate text with a random fact'
              ),
              usage: [getText('get facts'), getText('facts help')],
              contentSelector: '#fact > table > tbody > tr > td',
              spyWords: [getText('facts')],
              removeWords: [getText('get'), getText('please')],
              uri: 'https://randstuff.ru/fact/',
              contentCodepage: 'utf8',
            }),
          ],
          providers: [
            {
              provide: BOT_COMMANDS_PROVIDER,
              useClass: RuFactsGeneratorService,
            },
          ],
          exports: [ScraperModule],
        }),
        CustomInjectorModule.forFeature({
          imports: [
            ScraperModule.forRoot({
              name: getText('Facts generator'),
              descriptions: getText(
                'Command to generate text with a random fact'
              ),
              usage: [getText('get facts'), getText('facts help')],
              contentSelector: '#z',
              spyWords: [getText('facts')],
              removeWords: [getText('get'), getText('please')],
              uri: 'http://randomfactgenerator.net/',
            }),
          ],
          providers: [
            {
              provide: BOT_COMMANDS_PROVIDER,
              useClass: FactsGeneratorService,
            },
          ],
          exports: [ScraperModule],
        }),
      ],
    };
  }
}
