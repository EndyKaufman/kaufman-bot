import {
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsStorageProvider,
  BotCommandsToolsService,
  BOT_COMMANDS_STORAGE,
} from '@kaufman-bot/core-server';
import { Injectable } from '@nestjs/common';
import { Context } from 'grammy';
import { CustomInject } from 'nestjs-custom-injector';
import {
  CountOfPassengers,
  DemoTaxiLocalContext,
  DemoTaxiOrdersSteps,
  NavigationButtons,
} from '../demo-taxi-orders.types';
import { DemoTaxiOrdersRenderService } from './demo-taxi-orders-render.service';

@Injectable()
export class DemoTaxiOrders2CountOfPassengersService {
  @CustomInject(BOT_COMMANDS_STORAGE)
  botCommandsStorage!: BotCommandsStorageProvider<{
    context: DemoTaxiLocalContext;
  }>;

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

    if (renderedData.context.currentStep === DemoTaxiOrdersSteps.ContactPhone) {
      const contextMessageId =
        this.botCommandsToolsService.getContextMessageId(msg);
      const chatId = this.botCommandsToolsService.getChatId(msg);

      await ctx.api.deleteMessage(chatId, +contextMessageId);
      const message = await ctx.api.sendMessage(
        chatId,
        renderedData.text,
        renderedData.custom
      );
      const stateMessageId = String(message.message_id);
      await this.botCommandsStorage.changeMessageId(
        chatId,
        contextMessageId,
        stateMessageId
      );
      return {
        type: 'message',
        message: { ...msg, ...message },
        context: {
          ...renderedData.context,
          stateMessageId,
        },
      };
    }
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
