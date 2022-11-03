import {
  BotCommandsCategory,
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
} from '@kaufman-bot/core-server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesModule } from 'nestjs-translates';
import { DemoTaxiOrders0CancelService } from './demo-taxi-orders-services/demo-taxi-orders-0-cancel.service';
import { DemoTaxiOrders1DirectionService } from './demo-taxi-orders-services/demo-taxi-orders-1-direction.service';
import { DemoTaxiOrders2CountOfPassengersService } from './demo-taxi-orders-services/demo-taxi-orders-2-count-of-passengers.service';
import { DemoTaxiOrders3ContactPhoneService } from './demo-taxi-orders-services/demo-taxi-orders-3-contact-phone.service';
import { DemoTaxiOrders4FinishedService } from './demo-taxi-orders-services/demo-taxi-orders-4-finished.service';
import { DemoTaxiOrdersRenderService } from './demo-taxi-orders-services/demo-taxi-orders-render.service';
import { DemoTaxiOrdersService } from './demo-taxi-orders-services/demo-taxi-orders.service';
import {
  DemoTaxiOrdersConfig,
  DEMO_TAXI_ORDERS_CONFIG,
} from './demo-taxi-orders.config';

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
        DemoTaxiOrders0CancelService,
        DemoTaxiOrders1DirectionService,
        DemoTaxiOrders2CountOfPassengersService,
        DemoTaxiOrders3ContactPhoneService,
        DemoTaxiOrders4FinishedService,
        DemoTaxiOrdersRenderService,
        {
          provide: BOT_COMMANDS_PROVIDER,
          useClass: DemoTaxiOrdersService,
        },
      ],
      exports: [DEMO_TAXI_ORDERS_CONFIG],
    };
  }
}
