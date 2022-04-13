import {
  BotCommandsCategory,
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
} from '@kaufman-bot/core/server';
import { ScraperModule } from '@kaufman-bot/html-scraper/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { TranslatesModule } from 'nestjs-translates';
import { JokesGeneratorService } from './jokes-generator-services/jokes-generator.service';
import { RuJokesGeneratorService } from './jokes-generator-services/ru-jokes-generator.service';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  exports: [TranslatesModule, BotCommandsModule],
})
export class JokesGeneratorModule {
  static forRoot(): DynamicModule {
    return {
      module: JokesGeneratorModule,
      imports: [
        CustomInjectorModule.forFeature({
          imports: [
            ScraperModule.forRoot({
              title: getText('Jokes generator'),
              name: 'jokes',
              descriptions: getText(
                'Command to generate text with a random jokes'
              ),
              usage: [
                getText('get joke'),
                getText('get jokes'),
                getText('jokes help'),
              ],
              contextUsage: [getText('more'), getText('next')],
              contentSelector: '#joke > table > tbody > tr > td',
              spyWords: [getText('jokes'), getText('joke')],
              removeWords: [getText('get'), getText('please')],
              uri: 'https://randstuff.ru/joke/',
              contentCodepage: 'utf8',
              category: BotCommandsCategory.user,
            }),
          ],
          providers: [
            {
              provide: BOT_COMMANDS_PROVIDER,
              useClass: RuJokesGeneratorService,
            },
          ],
          exports: [ScraperModule],
        }),
        CustomInjectorModule.forFeature({
          imports: [
            ScraperModule.forRoot({
              title: getText('Jokes generator'),
              name: 'jokes',
              descriptions: getText(
                'Command to generate text with a random jokes'
              ),
              usage: [
                getText('get joke'),
                getText('get jokes'),
                getText('jokes help'),
              ],
              contextUsage: [getText('more'), getText('next')],
              contentSelector: 'data > joke',
              spyWords: [getText('jokes'), getText('joke')],
              removeWords: [getText('get'), getText('please')],
              uri: 'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single&format=xml',
              contentCodepage: 'utf8',
              category: BotCommandsCategory.user,
            }),
          ],
          providers: [
            {
              provide: BOT_COMMANDS_PROVIDER,
              useClass: JokesGeneratorService,
            },
          ],
          exports: [ScraperModule],
        }),
      ],
    };
  }
}
