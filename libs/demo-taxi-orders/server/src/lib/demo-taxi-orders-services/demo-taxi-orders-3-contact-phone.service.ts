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
export class DemoTaxiOrders3ContactPhoneService {
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
    let renderedData = this.demoTaxiOrdersRenderService.render(locale, {
      ...msg.context,
      currentStep: DemoTaxiOrdersSteps.Finished,
      contact: msg.contact,
      contactPhone: !Object.keys(NavigationButtons).includes(msg.data)
        ? msg.text || msg.contact.phone_number
        : msg.context.contactPhone,
      contactPhoneMessageId:
        msg.context.contactPhoneMessageId === undefined
          ? this.botCommandsToolsService.getContextMessageId(msg)
          : msg.context.contactPhoneMessageId,
    });

    if (msg.data === NavigationButtons.Prev) {
      renderedData = this.demoTaxiOrdersRenderService.render(locale, {
        ...msg.context,
        currentStep: DemoTaxiOrdersSteps.CountOfPassengers,
      });
    }

    if (renderedData.context.contactPhoneMessageId === undefined) {
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
    } else {
      if (renderedData.context.stateMessageId) {
        await ctx.telegram.editMessageText(
          this.botCommandsToolsService.getChatId(msg),
          +renderedData.context.stateMessageId,
          undefined,
          this.demoTaxiOrdersRenderService.render(locale, {
            currentStep: DemoTaxiOrdersSteps.ContactPhone,
          }).text
        );
      }

      return {
        type: 'text',
        ...this.demoTaxiOrdersRenderService.render(locale, {
          ...renderedData.context,
          stateMessageId: undefined,
          contactPhoneMessageId: undefined,
        }),
        message: msg,
      };
    }
  }
}
