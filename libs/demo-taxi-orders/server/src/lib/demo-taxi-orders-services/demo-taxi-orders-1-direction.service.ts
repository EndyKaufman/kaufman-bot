import {
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
} from '@kaufman-bot/core-server';
import { Injectable } from '@nestjs/common';
import { Context } from 'grammy';
import {
  DemoTaxiLocalContext,
  DemoTaxiOrdersSteps,
  Direction,
} from '../demo-taxi-orders.types';
import { DemoTaxiOrdersRenderService } from './demo-taxi-orders-render.service';

@Injectable()
export class DemoTaxiOrders1DirectionService {
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
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    const renderedData = this.demoTaxiOrdersRenderService.render(locale, {
      ...msg.context,
      currentStep: DemoTaxiOrdersSteps.CountOfPassengers,
      direction: (msg?.callbackQueryData &&
      Object.keys(Direction).includes(msg.callbackQueryData)
        ? msg.callbackQueryData || msg.context?.direction
        : undefined) as Direction,
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
