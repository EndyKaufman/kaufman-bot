import {
  BotCommandsProviderActionMsg,
  BotCommandsToolsService,
} from '@kaufman-bot/core-server';
import { Injectable } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInject } from 'nestjs-custom-injector';
import {
  DemoTaxiOrdersSteps,
  DemoTaxiOrdersStorage,
  DEMO_TAXI_ORDERS_STORAGE,
} from '../demo-taxi-orders.storage';
import { CommonService } from './common.service';

@Injectable()
export class StartStepService {
  @CustomInject(DEMO_TAXI_ORDERS_STORAGE)
  private readonly storage!: DemoTaxiOrdersStorage;

  private readonly currentStepKey = DemoTaxiOrdersSteps.Start;

  constructor(
    private readonly commonService: CommonService,
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}

  async is<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({ msg }: { msg: TMsg }) {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    const { stepKey } = await this.storage.getCurrentStep(
      this.botCommandsToolsService.getChatId(msg)
    );

    return (
      this.commonService.checkSpyWords({ msg }) &&
      stepKey === this.currentStepKey &&
      this.botCommandsToolsService.checkCommands(
        msg.text,
        [getText('start')],
        locale
      )
    );
  }

  async do<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({ msg }: { msg: TMsg }) {
    const { nextStepKey } = await this.storage.getCurrentStep(
      this.botCommandsToolsService.getChatId(msg)
    );
    await this.storage.pathState({
      userId: this.botCommandsToolsService.getChatId(msg),
      state: {
        messagesMetadata: [
          {
            step: this.currentStepKey,
            request: msg,
            response: msg,
          },
          {
            step: nextStepKey,
            request: msg,
          },
        ],
      },
    });
  }
}
