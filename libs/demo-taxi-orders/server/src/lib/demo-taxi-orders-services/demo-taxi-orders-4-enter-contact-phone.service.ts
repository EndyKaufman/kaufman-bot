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
  NavigationButtons,
} from '../demo-taxi-orders.types';
import { DemoTaxiOrdersRenderService } from './demo-taxi-orders-render.service';

@Injectable()
export class DemoTaxiOrders4EnterContactPhoneService {
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
            currentStep: DemoTaxiOrdersSteps.CountOfPassengers,
          })
        : this.demoTaxiOrdersRenderService.render(msg.locale, {
            ...msg.context,
            currentStep: DemoTaxiOrdersSteps.Complete,
            contact: msg.contact,
            contactPhone: msg.text,
          });

    if (renderedData.context?.currentStep === DemoTaxiOrdersSteps.Complete) {
      if (renderedData.context.stateMessageId) {
        await ctx.api.editMessageText(
          this.botCommandsToolsService.getChatId(msg),
          +renderedData.context.stateMessageId,
          this.demoTaxiOrdersRenderService.render(msg.locale, {
            currentStep: DemoTaxiOrdersSteps.ContactPhone,
          }).text,
          {}
        );
      }
      if (msg.callbackQueryData !== NavigationButtons.Prev) {
        await ctx.api.sendMessage(
          this.botCommandsToolsService.getChatId(msg),
          renderedData.text,
          renderedData.custom
        );
      }
    } else {
      await ctx.api.editMessageText(
        this.botCommandsToolsService.getChatId(msg),
        +this.botCommandsToolsService.getContextMessageId(msg),
        renderedData.text,
        renderedData.custom
      );
    }

    return {
      type: 'message',
      message: msg,
      context: renderedData.context,
    };
  }
}
