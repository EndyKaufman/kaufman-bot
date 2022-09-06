import {
  BotCommandsEnum,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
} from '@kaufman-bot/core-server';
import { Injectable } from '@nestjs/common';
import { CustomInject } from 'nestjs-custom-injector';
import {
  DemoTaxiOrdersConfig,
  DEMO_TAXI_ORDERS_CONFIG,
} from '../../demo-taxi-orders-config/demo-taxi-orders.config';
import { CommonService } from './common.service';

@Injectable()
export class HelpStepService {
  @CustomInject(DEMO_TAXI_ORDERS_CONFIG)
  private readonly config!: DemoTaxiOrdersConfig;

  constructor(
    private readonly commonService: CommonService,
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}

  async is({ msg }: { msg: BotCommandsProviderActionMsg }) {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    return (
      this.commonService.checkSpyWords({ msg }) &&
      this.botCommandsToolsService.checkCommands(
        msg.text,
        [BotCommandsEnum.help],
        locale
      )
    );
  }

  async out<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({
    msg,
  }: {
    msg: TMsg;
  }): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    return {
      type: 'markdown',
      message: msg,
      markdown: this.botCommandsToolsService.generateHelpMessage(msg, {
        locale,
        name: this.config.title,
        descriptions: this.config.descriptions,
        usage: this.config.usage,
        category: this.config.category,
      }),
    };
  }
}
