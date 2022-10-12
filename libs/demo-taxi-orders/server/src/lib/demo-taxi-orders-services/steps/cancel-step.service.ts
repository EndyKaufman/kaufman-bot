import {
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
} from '@kaufman-bot/core-server';
import { Injectable } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInject } from 'nestjs-custom-injector';
import { TranslatesService } from 'nestjs-translates';
import {
  DemoTaxiOrdersSteps,
  DemoTaxiOrdersStorage,
  DEMO_TAXI_ORDERS_STORAGE,
} from '../demo-taxi-orders.storage';
import { CommonService } from './common.service';

@Injectable()
export class CancelStepContextService {
  @CustomInject(DEMO_TAXI_ORDERS_STORAGE)
  private readonly storage!: DemoTaxiOrdersStorage;
  private readonly currentStepKey = DemoTaxiOrdersSteps.Finished;

  constructor(
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly translatesService: TranslatesService,
    private readonly commonService: CommonService
  ) {}

  async is({ msg }: { msg: BotCommandsProviderActionMsg }) {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    return (
      this.commonService.isContextProcess({ msg }) &&
      this.botCommandsToolsService.checkCommands(
        msg.text || msg.data,
        [
          getText('exit'),
          getText('reset'),
          getText('cancel'),
          getText('stop'),
          getText('end'),
        ],
        locale
      )
    );
  }

  async do<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg) {
    await this.storage.pathState({
      userId: this.botCommandsToolsService.getChatId(msg),
      state: {
        ...msg.botCommandHandlerContext,
        messagesMetadata: [
          {
            step: this.currentStepKey,
            response: msg,
          },
        ],
      },
    });
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
      type: 'text',
      text: this.translatesService.translate(
        getText(`{{close}} Meeting canceled`),
        locale,
        { close: '❌' }
      ),
      message: msg,
      callback: async (response) =>
        await this.storage.pathState({
          userId: this.botCommandsToolsService.getChatId(msg),
          state: {
            messagesMetadata: [
              {
                step: this.currentStepKey,
                response,
              },
            ],
          },
        }),
    };
  }
}
