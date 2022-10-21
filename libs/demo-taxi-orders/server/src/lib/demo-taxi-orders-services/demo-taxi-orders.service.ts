import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  OnContextBotCommands,
} from '@kaufman-bot/core-server';
import { Inject, Injectable } from '@nestjs/common';
import { Markup } from 'telegraf';
import {
  DemoTaxiOrdersConfig,
  DEMO_TAXI_ORDERS_CONFIG,
} from '../demo-taxi-orders-config/demo-taxi-orders.config';

@Injectable()
export class DemoTaxiOrdersService
  implements BotCommandsProvider, OnContextBotCommands
{
  botCommandHandlerId = DemoTaxiOrdersService.name;

  constructor(
    @Inject(DEMO_TAXI_ORDERS_CONFIG)
    private readonly config: DemoTaxiOrdersConfig
  ) {}

  async onContextBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg, ctx): Promise<BotCommandsProviderActionResultType<TMsg>> {
    // console.log(2, msg);
    if (+msg.text === 2) {
      return {
        type: 'text',
        text: '>2:' + msg.botCommandHandlerContext.date,
        message: msg,
        context: { message2: msg.botCommandHandlerContext.date + msg.text },
      };
    }
    if (+msg.text === 3 || msg.data === '>>3') {
      return {
        type: 'text',
        text: '>3:' + msg.botCommandHandlerContext.date,
        message: msg,
        context: {
          message3: msg.botCommandHandlerContext.date + (msg.text || msg.data),
        },
        custom: {
          ...Markup.inlineKeyboard([Markup.button.callback('3', '>>3')]),
        },
      };
    }
    return null;
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg, ctx): Promise<BotCommandsProviderActionResultType<TMsg>> {
    // console.log(1, msg);
    if (+msg.text === 2) {
      return null;
    }
    if (+msg.text === 1 || msg.data === '>>1') {
      const date = +new Date();
      return {
        type: 'text',
        text: '>1:' + date,
        message: msg,
        newState: true,
        custom: {
          ...Markup.inlineKeyboard([Markup.button.callback('1', '>>1')]),
        },
        context: { date, taxi: true, message1: msg.text || msg.data },
        callback: async (result, context) => {
          context.message1 = context.date + context.message1;
          // console.log(3, result, context);
        },
      };
    }
    return null;
  }

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg, ctx): Promise<BotCommandsProviderActionResultType<TMsg>> {
    return await this.onMessage(
      {
        ...msg,
        text: `${this.config.name} ${BotCommandsEnum.help}`,
      },
      ctx
    );
  }
}
