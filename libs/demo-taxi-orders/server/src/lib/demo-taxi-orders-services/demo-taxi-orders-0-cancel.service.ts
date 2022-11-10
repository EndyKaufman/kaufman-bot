import {
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
} from '@kaufman-bot/core-server';
import { Injectable } from '@nestjs/common';
import { Context } from 'grammy';
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
    ctx: Context
  ): Promise<BotCommandsProviderActionResultType<TMsg>> {
    await ctx.api.deleteMessage(
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
