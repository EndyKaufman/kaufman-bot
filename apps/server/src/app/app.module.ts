import { BotInGroupsModule } from '@kaufman-bot/bot-in-groups/server';
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
import env from 'env-var';
import { TelegrafModule } from 'nestjs-telegraf';
import {
  getDefaultTranslatesModuleOptions,
  TranslatesModule,
} from 'nestjs-translates';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const TELEGRAM_BOT_WEB_HOOKS_DOMAIN = env
  .get('TELEGRAM_BOT_WEB_HOOKS_DOMAIN')
  .asString();
const TELEGRAM_BOT_WEB_HOOKS_PATH = env
  .get('TELEGRAM_BOT_WEB_HOOKS_PATH')
  .asString();

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: env.get('TELEGRAM_BOT_TOKEN').required().asString(),
      launchOptions: {
        dropPendingUpdates: true,
        ...(TELEGRAM_BOT_WEB_HOOKS_DOMAIN && TELEGRAM_BOT_WEB_HOOKS_PATH
          ? {
              webhook: {
                domain: TELEGRAM_BOT_WEB_HOOKS_DOMAIN,
                hookPath: TELEGRAM_BOT_WEB_HOOKS_PATH,
              },
            }
          : {}),
      },
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
    DebugMessagesModule.forRoot(),
    BotCommandsModule.forRoot({
      prepareCommandString: (command?: string) =>
        (command || '').split('ё').join('е'),
    }),
    ShortCommandsModule.forRoot({
      commands: {
        en: {
          '*joke*': `get jokes`,
          '*quote*|*thought*|*wisdom*': 'get quotes',
          '*fact*|history': 'get facts',
          'forgot me': 'meet reset',
          '*what you can do*|faq': 'help',
          'disable debug': 'debug off',
          'enable debug': 'debug on',
        },
        ru: {
          '*joke*|*шутка|*шутку|*шутки|пошути*|шути|рассмеши|смешинки|смешинка':
            'get jokes',
          '*quote*|*thought|*wisdom*|цитата|дай цитату|цитируй|*мысль|*мудрость|*залечи*':
            'get quotes',
          '*fact*|history|история|*историю|*факты': 'get facts',
          'forgot me|забудь меня': 'meet reset',
          '*what you can do*|faq|*что ты умеешь*|справка': 'help',
          'disable debug|выключи дебаг': 'debug off',
          'enable debug|включи дебаг': 'debug on',
        },
      },
    }),
    BotInGroupsModule.forRoot({
      botNames: {
        en: ['Endy', 'Kaufman'],
        ru: ['Энди', 'Endy', 'Kaufman', 'Енди', 'Кауфман'],
      },
      botMeetingInformation: {
        en: [`Hello! I'm Endy 😉`, 'Hello!', 'Hello 🖖'],
        ru: [`Всем привет! я Энди 😉`, `Всем привет!`, 'Всем привет 🖖'],
      },
      botDoNotHaveFullAccess: {
        en: [
          `I not have access to read messages and process your commands 😢, please give me access 😉`,
        ],
        ru: [
          `У меня нет доступа на чтение ваших сообщений и обработку команд 😢, пожалуйста дайте мне доступ 😉`,
        ],
      },
      botNowHaveFullAccess: {
        en: [`Now I have access, thanks 😉`],
        ru: [`Теперь у меня есть доступ, спасибо 😉`],
      },
    }),
    LanguageSwitherModule.forRoot(),
    CurrencyConverterModule.forRoot(),
    FactsGeneratorModule.forRoot(),
    QuotesGeneratorModule.forRoot(),
    JokesGeneratorModule.forRoot(),
    FirstMeetingModule.forRoot({ botName: { en: 'Endy', ru: 'Энди' } }),
    DialogflowModule.forRoot({
      projectId: env.get('DIALOGFLOW_PROJECT_ID').required().asString(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
