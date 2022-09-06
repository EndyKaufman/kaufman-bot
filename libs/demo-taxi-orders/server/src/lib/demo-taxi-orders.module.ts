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
} from './demo-taxi-orders-config/demo-taxi-orders.config';
import { DemoTaxiOrdersService } from './demo-taxi-orders-services/demo-taxi-orders.service';
import {
  DemoTaxiOrdersStorage,
  DEMO_TAXI_ORDERS_STORAGE,
} from './demo-taxi-orders-services/demo-taxi-orders.storage';
import { CancelStepContextService } from './demo-taxi-orders-services/steps/cancel-step.service';
import { CommonService } from './demo-taxi-orders-services/steps/common.service';
import { DirectionStepContextService } from './demo-taxi-orders-services/steps/direction-step.service';
import { HelpStepService } from './demo-taxi-orders-services/steps/help-step.service';
import { StartStepService } from './demo-taxi-orders-services/steps/start-step.service';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  providers: [
    { provide: DEMO_TAXI_ORDERS_STORAGE, useClass: DemoTaxiOrdersStorage },
    CommonService,
    StartStepService,
    DirectionStepContextService,
    CancelStepContextService,
    HelpStepService,
  ],
  exports: [
    TranslatesModule,
    BotCommandsModule,
    DEMO_TAXI_ORDERS_STORAGE,
    CommonService,
    StartStepService,
    DirectionStepContextService,
    CancelStepContextService,
    HelpStepService,
  ],
})
export class DemoTaxiOrdersModuleCore {}

@Module({
  imports: [DemoTaxiOrdersModuleCore],
  exports: [DemoTaxiOrdersModuleCore],
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
            usage: [getText('taxi ping'), getText('taxi help')],
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
