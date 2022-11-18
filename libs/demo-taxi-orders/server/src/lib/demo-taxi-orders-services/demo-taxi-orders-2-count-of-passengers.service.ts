import {
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
} from '@kaufman-bot/core-server';
import { Injectable } from '@nestjs/common';
import { Context } from 'grammy';
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
    ctx: Context
  ): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const renderedData =
      msg.callbackQueryData === NavigationButtons.Prev
        ? this.demoTaxiOrdersRenderService.render(msg.locale, {
            ...msg.context,
            currentStep: DemoTaxiOrdersSteps.Direction,
          })
        : this.demoTaxiOrdersRenderService.render(msg.locale, {
            ...msg.context,
            currentStep: DemoTaxiOrdersSteps.ContactPhone,
            stateMessageId:
              this.botCommandsToolsService.getContextMessageId(msg),
            countOfPassengers: (Object.values(CountOfPassengers).find(
              (value) => +value === +(msg.callbackQueryData || 0)
            )
              ? msg.callbackQueryData || msg.context?.countOfPassengers
              : undefined) as CountOfPassengers,
          });

    await ctx.api.editMessageText(
      this.botCommandsToolsService.getChatId(msg),
      +this.botCommandsToolsService.getContextMessageId(msg),
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
