import {
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
} from '@kaufman-bot/core-server';
import { Injectable } from '@nestjs/common';
import { Telegram } from 'telegraf';
import {
  DemoTaxiLocalContext,
  DemoTaxiOrdersSteps,
  NavigationButtons,
} from '../demo-taxi-orders.types';
import { DemoTaxiOrdersRenderService } from './demo-taxi-orders-render.service';

@Injectable()
export class DemoTaxiOrders4FinishedService {
  constructor(
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly demoTaxiOrdersRenderService: DemoTaxiOrdersRenderService
  ) {}

  async process<
    TMsg extends BotCommandsProviderActionMsg<DemoTaxiLocalContext> = BotCommandsProviderActionMsg<DemoTaxiLocalContext>
  >(
    msg: TMsg,
    ctx: { telegram: Telegram }
  ): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    const renderedData =
      msg.data === NavigationButtons.Prev
        ? this.demoTaxiOrdersRenderService.render(locale, {
            ...msg.context,
            stateMessageId:
              this.botCommandsToolsService.getContextMessageId(msg),
            currentStep: DemoTaxiOrdersSteps.ContactPhone,
          })
        : this.demoTaxiOrdersRenderService.render(locale, {
            ...msg.context,
            currentStep: DemoTaxiOrdersSteps.Finished,
          });

    await ctx.telegram.editMessageText(
      this.botCommandsToolsService.getChatId(msg),
      +this.botCommandsToolsService.getContextMessageId(msg),
      undefined,
      renderedData.text,
      msg.data === NavigationButtons.Done ? undefined : renderedData.custom
    );

    return {
      type: 'message',
      message: msg,
      context: renderedData.context,
    };
  }
}
