import {
  BotCommandsCategory,
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
} from '@kaufman-bot/core-server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesModule } from 'nestjs-translates';
import {
  DemoTaxiOrdersConfig,
  DEMO_TAXI_ORDERS_CONFIG,
} from './demo-taxi-orders.config';
import { DemoTaxiOrdersService } from './demo-taxi-orders.service';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  exports: [TranslatesModule, BotCommandsModule],
})
export class DemoTaxiOrdersModule {
  static forRoot(): DynamicModule {
    return {
      module: DemoTaxiOrdersModule,
      providers: [
        {
          provide: DEMO_TAXI_ORDERS_CONFIG,
          useValue: <DemoTaxiOrdersConfig>{
            title: getText('Demo taxi orders commands'),
            name: 'taxi',
            usage: [getText('get taxi'), getText('taxi help')],
            descriptions: getText('Commands for demo taxi orders'),
            spyWords: [getText('taxi')],
            category: BotCommandsCategory.user,
          },
        },
        {
          provide: BOT_COMMANDS_PROVIDER,
          useClass: DemoTaxiOrdersService,
        },
      ],
      exports: [DEMO_TAXI_ORDERS_CONFIG],
    };
  }
}
