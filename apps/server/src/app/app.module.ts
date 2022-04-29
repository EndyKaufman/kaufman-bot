import { BotInGroupsModule } from '@kaufman-bot/bot-in-groups-server';
import { BotCommandsModule } from '@kaufman-bot/core-server';
import { CurrencyConverterModule } from '@kaufman-bot/currency-converter-server';
import { DebugMessagesModule } from '@kaufman-bot/debug-messages-server';
import { DialogflowModule } from '@kaufman-bot/dialogflow-server';
import { FactsGeneratorModule } from '@kaufman-bot/facts-generator-server';
import { FirstMeetingModule } from '@kaufman-bot/first-meeting-server';
import { JokesGeneratorModule } from '@kaufman-bot/jokes-generator-server';
import { LanguageSwitherModule } from '@kaufman-bot/language-swither-server';
import { PrismaClientModule } from '@kaufman-bot/prisma-server';
import { QuotesGeneratorModule } from '@kaufman-bot/quotes-generator-server';
import { ShortCommandsModule } from '@kaufman-bot/short-commands-server';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import env from 'env-var';
import { TelegrafModule } from 'nestjs-telegraf';
import {
  getDefaultTranslatesModuleOptions,
  TranslatesModule,
} from 'nestjs-translates';
import { join } from 'path';
import { AppService } from './app.service';
import { PrismaIntegrationsModule } from './integrations/prisma/prisma-integrations.module';

const TELEGRAM_BOT_WEB_HOOKS_DOMAIN = env
  .get('TELEGRAM_BOT_WEB_HOOKS_DOMAIN')
  .asString();
const TELEGRAM_BOT_WEB_HOOKS_PATH = env
  .get('TELEGRAM_BOT_WEB_HOOKS_PATH')
  .asString();

const BOT_NAMES = env.get('BOT_NAMES').required().asArray();
const BOT_NAMES_RU = env.get('BOT_NAMES_RU').required().asArray();

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'assets', 'public'),
    }),
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
    PrismaIntegrationsModule.forRoot(),
    TranslatesModule.forRoot(
      getDefaultTranslatesModuleOptions({
        localePaths: [
          join(__dirname, 'assets', 'i18n'),
          join(__dirname, 'assets', 'i18n', 'getText'),
          join(__dirname, 'assets', 'i18n', 'class-validator-messages'),
        ],
        vendorLocalePaths: [join(__dirname, 'assets', 'i18n')],
        locales: ['en', 'ru'],
      })
    ),
    DebugMessagesModule.forRoot(),
    BotCommandsModule.forRoot({
      admins: env.get('TELEGRAM_BOT_ADMINS').default('').asArray(','),
      prepareCommandString: (command?: string) =>
        (command || '').split('ё').join('е'),
      commit: env.get('DEPLOY_COMMIT').default('').asString(),
      date: env.get('DEPLOY_DATE').default('').asString(),
      version: env.get('DEPLOY_VERSION').default('').asString(),
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
          '*joke*|*шутка|*шутку|*шутки|пошути*|шути|рассмеши|смешинки|смешинка|*жги':
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
        en: BOT_NAMES,
        ru: BOT_NAMES_RU,
      },
      botMeetingInformation: {
        en: [`Hello! I'm ${BOT_NAMES[0]} 😉`, 'Hello!', 'Hello 🖖'],
        ru: [`Привет! я ${BOT_NAMES_RU[0]} 😉`, `Привет!`, 'Привет 🖖'],
      },
    }),
    LanguageSwitherModule.forRoot(),
    CurrencyConverterModule.forRoot(),
    FactsGeneratorModule.forRoot(),
    QuotesGeneratorModule.forRoot(),
    JokesGeneratorModule.forRoot(),
    FirstMeetingModule.forRoot({
      botName: { en: BOT_NAMES[0], ru: BOT_NAMES_RU[0] },
    }),
    DialogflowModule.forRoot({
      projectId: env.get('DIALOGFLOW_PROJECT_ID').required().asString(),
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
