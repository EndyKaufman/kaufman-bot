import { CurrencyConverterModule } from '@kaufman-bot/currency-converter/server';
import { FactsGeneratorModule } from '@kaufman-bot/facts-generator/server';
import { Module } from '@nestjs/common';
import env from 'env-var';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: env.get('TELEGRAM_BOT_TOKEN').required().asString(),
    }),
    CurrencyConverterModule.forRoot(),
    FactsGeneratorModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
