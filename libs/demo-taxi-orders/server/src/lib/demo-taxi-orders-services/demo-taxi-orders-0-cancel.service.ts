import {
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
} from '@kaufman-bot/core-server';
import { Injectable } from '@nestjs/common';
import { Telegram } from 'telegraf';
import { DemoTaxiLocalContext } from '../demo-taxi-orders.types';

@Injectable()
export class DemoTaxiOrders0CancelService {
  constructor(
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}

  async process<
    TMsg extends BotCommandsProviderActionMsg<DemoTaxiLocalContext> = BotCommandsProviderActionMsg<DemoTaxiLocalContext>
  >(
    msg: TMsg,
    ctx: { telegram: Telegram }
  ): Promise<BotCommandsProviderActionResultType<TMsg>> {
    await ctx.telegram.deleteMessage(
      this.botCommandsToolsService.getChatId(msg),
      +this.botCommandsToolsService.getContextMessageId(msg)
    );
    msg.handlerStop = true;
    return {
      type: 'stop',
      message: msg,
    };
  }
}
