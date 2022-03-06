import { CommandToolsModule } from '@kaufman-bot/core/server';
import { CurrencyConverterModule } from '@kaufman-bot/currency-converter/server';
import { FactsGeneratorModule } from '@kaufman-bot/facts-generator/server';
import { LanguageSwitherModule } from '@kaufman-bot/language-swither/server';
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

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: env.get('TELEGRAM_BOT_TOKEN').required().asString(),
    }),
    TranslatesModule.forRoot(
      getDefaultTranslatesModuleOptions({
        localePaths: [
          join(__dirname, 'assets', 'i18n'),
          join(__dirname, 'assets', 'i18n', 'class-validator-messages'),
        ],
        vendorLocalePaths: [join(__dirname, 'assets', 'i18n')],
        locales: ['en', 'ru'],
      })
    ),
    CommandToolsModule,
    LanguageSwitherModule.forRoot(),
    CurrencyConverterModule.forRoot(),
    FactsGeneratorModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
