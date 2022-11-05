import { BotCommandsProviderActionMsg } from '@kaufman-bot/core-server';
import { Telegram } from 'telegraf';

export const DEMO_TAXI_ORDERS_CONFIG = 'DEMO_TAXI_ORDERS_CONFIG';

export interface DemoTaxiOrdersConfig {
  title: string;
  name: string;
  descriptions: string;
  usage: string[];
  spyWords: string[];
  botName: { [langCode: string]: string };
  category: string;
  onComplete?: <
    TDemoTaxiLocalContext,
    TMsg extends BotCommandsProviderActionMsg<TDemoTaxiLocalContext> = BotCommandsProviderActionMsg<TDemoTaxiLocalContext>
  >(
    msg: TMsg,
    ctx: { telegram: Telegram },
    message: string
  ) => Promise<unknown>;
}
