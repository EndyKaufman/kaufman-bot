import {
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
} from '@kaufman-bot/core-server';
import { Injectable } from '@nestjs/common';
import { Telegram } from 'telegraf';
import {
  CountOfPassengers,
  DemoTaxiLocalContext,
  DemoTaxiOrdersSteps,
  NavigationButtons,
} from '../demo-taxi-orders.types';
import { DemoTaxiOrdersRenderService } from './demo-taxi-orders-render.service';

@Injectable()
export class DemoTaxiOrders2CountOfPassengersService {
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
            currentStep: DemoTaxiOrdersSteps.Direction,
          })
        : this.demoTaxiOrdersRenderService.render(locale, {
            ...msg.context,
            currentStep: DemoTaxiOrdersSteps.ContactPhone,
            stateMessageId:
              this.botCommandsToolsService.getContextMessageId(msg),
            countOfPassengers: (Object.values(CountOfPassengers).find(
              (value) => +value === +msg.data
            )
              ? msg.data || msg.context.countOfPassengers
              : undefined) as CountOfPassengers,
          });

    await ctx.telegram.editMessageText(
      this.botCommandsToolsService.getChatId(msg),
      +this.botCommandsToolsService.getContextMessageId(msg),
      undefined,
      renderedData.text,
      renderedData.custom
    );

    return {
      type: 'message',
      message: msg,
      context: renderedData.context,
    };
  }
}
