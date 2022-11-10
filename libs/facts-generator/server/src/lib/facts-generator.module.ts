import {
  BotCommandsCategory,
  BotCommandsEnum,
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER
} from '@kaufman-bot/core-server';
import { ScraperModule } from '@kaufman-bot/html-scraper-server';
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
              title: getText('Facts generator'),
              name: 'facts',
              descriptions: getText(
                'Command to generate text with a random fact'
              ),
              usage: [
                getText('get facts'),
                getText('get fact'),
                getText('facts help'),
              ],
              contextUsage: [getText('more'), getText('next')],
              contentSelector: '#fact > table > tbody > tr > td',
              headers: [],
              spyWords: [getText('facts'), getText('fact')],
              removeWords: [BotCommandsEnum.get, getText('please')],
              uri: 'https://randstuff.ru/fact/',
              contentCodepage: 'utf8',
              category: [BotCommandsCategory.user, BotCommandsCategory.group],
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
              title: getText('Facts generator'),
              name: 'facts',
              descriptions: getText(
                'Command to generate text with a random fact'
              ),
              usage: [
                getText('get facts'),
                getText('get fact'),
                getText('facts help'),
              ],
              contextUsage: [getText('more'), getText('next')],
              contentSelector: '#z',
              spyWords: [getText('facts'), getText('fact')],
              removeWords: [BotCommandsEnum.get, getText('please')],
              uri: 'http://randomfactgenerator.net/',
              category: [BotCommandsCategory.user, BotCommandsCategory.group],
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
