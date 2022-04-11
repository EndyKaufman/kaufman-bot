import {
  BotCommandsModule,
  PrismaClientModule,
} from '@kaufman-bot/core/server';
import { CurrencyConverterModule } from '@kaufman-bot/currency-converter/server';
import { DebugMessagesModule } from '@kaufman-bot/debug-messages/server';
import { DialogflowModule } from '@kaufman-bot/dialogflow/server';
import { FactsGeneratorModule } from '@kaufman-bot/facts-generator/server';
import { FirstMeetingModule } from '@kaufman-bot/first-meeting/server';
import { JokesGeneratorModule } from '@kaufman-bot/jokes-generator/server';
import {
  DEFAULT_LANGUAGE,
  LanguageSwitherModule,
} from '@kaufman-bot/language-swither/server';
import { QuotesGeneratorModule } from '@kaufman-bot/quotes-generator/server';
import { ShortCommandsModule } from '@kaufman-bot/short-commands/server';
import { Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import env from 'env-var';
import { TelegrafModule } from 'nestjs-telegraf';
import {
  getDefaultTranslatesModuleOptions,
  TranslatesModule,
} from 'nestjs-translates';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: env.get('TELEGRAM_BOT_TOKEN').required().asString(),
    }),
    PrismaClientModule.forRoot({
      databaseUrl: env.get('SERVER_POSTGRES_URL').required().asString(),
      logging: 'long_queries',
      maxQueryExecutionTime: 5000,
    }),
    TranslatesModule.forRoot(
      getDefaultTranslatesModuleOptions({
        localePaths: [
          join(__dirname, 'assets', 'i18n'),
          join(__dirname, 'assets', 'i18n', 'getText'),
          join(__dirname, 'assets', 'i18n', 'class-validator-messages'),
        ],
        vendorLocalePaths: [join(__dirname, 'assets', 'i18n')],
        locales: [DEFAULT_LANGUAGE, 'ru'],
      })
    ),
    BotCommandsModule.forRoot({
      prepareCommandString: (command?: string) =>
        (command || '').split('ё').join('е'),
    }),
    LanguageSwitherModule.forRoot(),
    DebugMessagesModule.forRoot(),
    ShortCommandsModule.forRoot({
      commands: {
        en: {
          joke: `get jokes`,
          'quote|thought|wisdom': 'get quotes',
          'facts|fact|history': 'get facts',
          'forgot me': 'meet reset',
          'what you can do|faq': 'help',
        },
        ru: {
          'joke|jokes|*шутка|*шутку|*шутки|пошути|шути|рассмеши|смешинки|смешинка':
            'get jokes',
          'quote*|thought|wisdom*|цитата|дай цитату|цитируй|*мысль|*мудрость|*залечи*':
            'get quotes',
          'facts|fact|history|история|*историю': 'get facts',
          'forgot me|забудь меня': 'meet reset',
          'what you can do|faq|что ты умеешь|справка': 'help',
        },
      },
    }),
    CurrencyConverterModule.forRoot(),
    FactsGeneratorModule.forRoot(),
    QuotesGeneratorModule.forRoot(),
    JokesGeneratorModule.forRoot(),
    FirstMeetingModule.forRoot({ botName: getText('Endy') }),
    DialogflowModule.forRoot({
      projectId: env.get('DIALOGFLOW_PROJECT_ID').required().asString(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
