import {
  BotCommandsProviderActionMsg,
  BotCommandsToolsService,
} from '@kaufman-bot/core-server';
import { Injectable } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInject } from 'nestjs-custom-injector';
import {
  DemoTaxiOrdersConfig,
  DEMO_TAXI_ORDERS_CONFIG,
} from '../../demo-taxi-orders-config/demo-taxi-orders.config';
import { DemoTaxiOrders } from '../demo-taxi-orders.storage';

export const DISABLE_DEMO_TAXI_ORDERS_COMMANDS =
  'DISABLE_DEMO_TAXI_ORDERS_COMMANDS';

@Injectable()
export class CommonService {
  @CustomInject(DEMO_TAXI_ORDERS_CONFIG)
  private readonly config!: DemoTaxiOrdersConfig;

  constructor(
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}

  prepareText(text: string, locale: string) {
    if (
      this.botCommandsToolsService.checkCommands(
        text,
        [getText('skip'), getText('next')],
        locale
      )
    ) {
      return '';
    }
    return this.botCommandsToolsService
      .clearCommands(
        text,
        [getText('hi'), getText('hello'), getText('hey')],
        locale
      )
      .trim();
  }

  isContextProcess({ msg }: { msg: BotCommandsProviderActionMsg }) {
    const botCommandHandlerContext: Partial<DemoTaxiOrders> =
      msg.botCommandHandlerContext;
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    return (
      this.botCommandsToolsService.checkCommands(
        msg.text,
        [this.config.name],
        locale
      ) || Object.keys(botCommandHandlerContext || {}).length > 0
    );
  }

  async isDisable({ msg }: { msg: BotCommandsProviderActionMsg }) {
    return msg?.botGlobalContext?.[DISABLE_DEMO_TAXI_ORDERS_COMMANDS];
  }

  checkSpyWords({ msg }: { msg: BotCommandsProviderActionMsg }) {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    return this.config.spyWords.find((spyWord) =>
      this.botCommandsToolsService.checkCommands(msg.text, [spyWord], locale)
    );
  }
}
