import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  OnContextBotCommands,
} from '@kaufman-bot/core-server';
import { Inject, Injectable } from '@nestjs/common';
import { CustomInject } from 'nestjs-custom-injector';
import {
  DemoTaxiOrdersConfig,
  DEMO_TAXI_ORDERS_CONFIG,
} from '../demo-taxi-orders-config/demo-taxi-orders.config';
import {
  DemoTaxiOrdersStorage,
  DEMO_TAXI_ORDERS_STORAGE,
} from './demo-taxi-orders.storage';
import { CancelStepContextService } from './steps/cancel-step.service';
import { CommonService } from './steps/common.service';
import { DirectionStepContextService } from './steps/direction-step.service';
import { HelpStepService } from './steps/help-step.service';
import { StartStepService } from './steps/start-step.service';

@Injectable()
export class DemoTaxiOrdersService
  implements BotCommandsProvider, OnContextBotCommands
{
  @CustomInject(DEMO_TAXI_ORDERS_STORAGE)
  private readonly storage!: DemoTaxiOrdersStorage;

  constructor(
    @Inject(DEMO_TAXI_ORDERS_CONFIG)
    private readonly config: DemoTaxiOrdersConfig,
    private readonly commonService: CommonService,
    private readonly startStepService: StartStepService,
    private readonly directionStepService: DirectionStepContextService,
    private readonly cancelStepContextService: CancelStepContextService,
    private readonly helpStepService: HelpStepService
  ) {}

  async onContextBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg, ctx): Promise<BotCommandsProviderActionResultType<TMsg>> {
    if (await this.commonService.isDisable({ msg })) {
      return null;
    }

    if (await this.cancelStepContextService.is({ msg })) {
      await this.cancelStepContextService.do<TMsg>(msg);
      return await this.cancelStepContextService.out<TMsg>({ msg });
    }

    if (await this.directionStepService.is({ msg, ctx })) {
      return await this.directionStepService.out<TMsg>({ msg });
    }

    return { type: 'stop', message: msg };
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    if (await this.commonService.isDisable({ msg })) {
      return null;
    }

    if (await this.helpStepService.is({ msg })) {
      return await this.helpStepService.out<TMsg>({ msg });
    }

    if (await this.startStepService.is({ msg })) {
      await this.startStepService.do<TMsg>({ msg });
      return { type: 'message', message: msg, recursive: true };
    }

    return null;
  }

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    return await this.onMessage({
      ...msg,
      text: `${this.config.name} ${BotCommandsEnum.help}`,
    });
  }
}
