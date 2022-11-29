import { InjectBot, NestjsGrammyModule } from '@grammyjs/nestjs';
import { BotInGroupsModule } from '@kaufman-bot/bot-in-groups-server';
import {
  BotCommandsModule,
  BotCommandsProviderActionMsg,
} from '@kaufman-bot/core-server';
import { CurrencyConverterModule } from '@kaufman-bot/currency-converter-server';
import { DebugMessagesModule } from '@kaufman-bot/debug-messages-server';
import {
  DemoTaxiOrdersModule,
  DISABLE_DEMO_TAXI_ORDERS_COMMANDS,
} from '@kaufman-bot/demo-taxi-orders-server';
import {
  DialogflowModule,
  DISABLE_DIALOGFLOW_COMMANDS,
} from '@kaufman-bot/dialogflow-server';
import { FactsGeneratorModule } from '@kaufman-bot/facts-generator-server';
import {
  DISABLE_FIRST_MEETING_COMMANDS,
  FirstMeetingModule,
} from '@kaufman-bot/first-meeting-server';
import { JokesGeneratorModule } from '@kaufman-bot/jokes-generator-server';
import { LanguageSwitcherModule } from '@kaufman-bot/language-switcher-server';
import { PrismaClientModule } from '@kaufman-bot/prisma-server';
import { QuotesGeneratorModule } from '@kaufman-bot/quotes-generator-server';
import {
  DISABLE_SHORT_COMMANDS__BEFORE_HOOK,
  ShortCommandsModule,
  ShortCommandsToolsService,
} from '@kaufman-bot/short-commands-server';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import env from 'env-var';
import { Bot, Context, webhookCallback } from 'grammy';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import {
  getDefaultTranslatesModuleOptions,
  TranslatesModule,
  TRANSLATES_DEFAULT_LOCALE,
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
    CustomInjectorModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'assets', 'public'),
    }),
    NestjsGrammyModule.forRoot({
      token: env.get('TELEGRAM_BOT_TOKEN').required().asString(),
      ...(TELEGRAM_BOT_WEB_HOOKS_DOMAIN && TELEGRAM_BOT_WEB_HOOKS_PATH
        ? {
            useWebhook: true,
          }
        : {}),
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
        locales: [TRANSLATES_DEFAULT_LOCALE, 'ru'],
        defaultLocale: 'ru',
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
      botMeetingInformation: {
        [TRANSLATES_DEFAULT_LOCALE]: [
          `Hello! I'm ${BOT_NAMES[0]} 😉`,
          'Hello!',
          'Hello 🖖',
        ],
        ru: [`Привет! я ${BOT_NAMES_RU[0]} 😉`, `Привет!`, 'Привет 🖖'],
      },
    }),
    ShortCommandsModule.forRoot({
      commands: {
        [TRANSLATES_DEFAULT_LOCALE]: {
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
    BotInGroupsModule.forRootAsync({
      imports: [ShortCommandsModule],
      useFactory: async (
        shortCommandsToolsService: ShortCommandsToolsService
      ) => ({
        defaultGroupGlobalContext: {
          [DISABLE_FIRST_MEETING_COMMANDS]: true,
          [DISABLE_SHORT_COMMANDS__BEFORE_HOOK]: true,
          [DISABLE_DIALOGFLOW_COMMANDS]: true,
          [DISABLE_DEMO_TAXI_ORDERS_COMMANDS]: true,
        },
        botNames: {
          [TRANSLATES_DEFAULT_LOCALE]: BOT_NAMES,
          ru: BOT_NAMES_RU,
        },
        botMeetingInformation: {
          [TRANSLATES_DEFAULT_LOCALE]: [
            `Hello! I'm ${BOT_NAMES[0]} 😉`,
            'Hello!',
            'Hello 🖖',
          ],
          ru: [`Привет! я ${BOT_NAMES_RU[0]} 😉`, `Привет!`, 'Привет 🖖'],
        },
        transformMessageText: (locale: string, messageText: string) =>
          shortCommandsToolsService.updateTextWithShortCommands(
            locale,
            messageText
          ),
      }),
      inject: [ShortCommandsToolsService],
    }),

    LanguageSwitcherModule.forRoot(),
    CurrencyConverterModule.forRoot(),
    FactsGeneratorModule.forRoot(),
    QuotesGeneratorModule.forRoot(),
    JokesGeneratorModule.forRoot(),
    FirstMeetingModule.forRoot({
      botName: {
        [TRANSLATES_DEFAULT_LOCALE]: BOT_NAMES[0],
        ru: BOT_NAMES_RU[0],
      },
    }),
    DialogflowModule.forRoot({
      projectId: env.get('DIALOGFLOW_PROJECT_ID').required().asString(),
    }),
    DemoTaxiOrdersModule.forRoot({
      onComplete: async <DemoTaxiLocalContext>(
        msg: BotCommandsProviderActionMsg<DemoTaxiLocalContext>,
        ctx: Context,
        message: string
      ) => {
        const admins = env.get('TELEGRAM_BOT_ADMINS').default('').asArray(',');
        for (let index = 0; index < admins.length; index++) {
          const admin = admins[index];
          let chat = String(ctx.chat?.id);
          if (
            ctx.chat?.type === 'channel' ||
            ctx.chat?.type === 'private' ||
            ctx.chat?.type === 'supergroup'
          ) {
            chat = `@${ctx.chat?.username}`;
          }
          if (ctx.chat?.type === 'group') {
            chat = `${ctx.chat?.title} (${ctx.chat?.id})`;
          }
          await ctx.api.sendMessage(
            admin,
            [
              `Chat: ${chat}`,
              `Message id: ${msg.message_id}`,
              '',
              message,
            ].join('\n')
          );
        }
      },
    }),
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(
    @InjectBot()
    private readonly bot: Bot<Context>
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const webhook = env.get('TELEGRAM_BOT_WEB_HOOKS_PATH').asString();
    if (webhook) {
      consumer.apply(webhookCallback(this.bot, 'express')).forRoutes(webhook);
    }
  }
}
