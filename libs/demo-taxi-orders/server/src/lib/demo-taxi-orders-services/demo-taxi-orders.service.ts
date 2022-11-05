import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
  OnContextBotCommands,
} from '@kaufman-bot/core-server';
import { Inject, Injectable } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { Telegram } from 'telegraf';
import {
  DemoTaxiOrdersConfig,
  DEMO_TAXI_ORDERS_CONFIG,
} from '../demo-taxi-orders.config';
import {
  DemoTaxiLocalContext,
  DemoTaxiOrdersSteps,
  NavigationButtons,
} from '../demo-taxi-orders.types';
import { DemoTaxiOrders0CancelService } from './demo-taxi-orders-0-cancel.service';
import { DemoTaxiOrders1DirectionService } from './demo-taxi-orders-1-direction.service';
import { DemoTaxiOrders2CountOfPassengersService } from './demo-taxi-orders-2-count-of-passengers.service';
import { DemoTaxiOrders3ContactPhoneService } from './demo-taxi-orders-3-contact-phone.service';
import { DemoTaxiOrders4CompleteService } from './demo-taxi-orders-4-complete.service';
import { DemoTaxiOrdersRenderService } from './demo-taxi-orders-render.service';

@Injectable()
export class DemoTaxiOrdersService
  implements
    BotCommandsProvider<DemoTaxiLocalContext>,
    OnContextBotCommands<DemoTaxiLocalContext>
{
  handlerId = DemoTaxiOrdersService.name;

  constructor(
    @Inject(DEMO_TAXI_ORDERS_CONFIG)
    private readonly config: DemoTaxiOrdersConfig,
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly demoTaxiOrdersRenderService: DemoTaxiOrdersRenderService,
    private readonly demoTaxiOrders0CancelProcessorService: DemoTaxiOrders0CancelService,
    private readonly demoTaxiOrders1DirectionProcessorService: DemoTaxiOrders1DirectionService,
    private readonly demoTaxiOrders2CountOfPassengersService: DemoTaxiOrders2CountOfPassengersService,
    private readonly demoTaxiOrders3ContactPhoneService: DemoTaxiOrders3ContactPhoneService,
    private readonly demoTaxiOrders4CompleteService: DemoTaxiOrders4CompleteService
  ) {}

  async onContextBotCommands<
    TMsg extends BotCommandsProviderActionMsg<DemoTaxiLocalContext> = BotCommandsProviderActionMsg<DemoTaxiLocalContext>
  >(
    msg: TMsg,
    ctx: { telegram: Telegram }
  ): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const currentStep = msg.context.currentStep;

    if (currentStep === DemoTaxiOrdersSteps.End) {
      return null;
    }

    if (
      currentStep &&
      Object.keys(DemoTaxiOrdersSteps).includes(currentStep) &&
      msg.data === NavigationButtons.Cancel
    ) {
      return await this.demoTaxiOrders0CancelProcessorService.process(msg, ctx);
    }

    if (currentStep === DemoTaxiOrdersSteps.Direction) {
      return await this.demoTaxiOrders1DirectionProcessorService.process(
        msg,
        ctx
      );
    }

    if (currentStep === DemoTaxiOrdersSteps.CountOfPassengers) {
      return await this.demoTaxiOrders2CountOfPassengersService.process(
        msg,
        ctx
      );
    }

    if (currentStep === DemoTaxiOrdersSteps.ContactPhone) {
      return await this.demoTaxiOrders3ContactPhoneService.process(msg, ctx);
    }

    if (currentStep === DemoTaxiOrdersSteps.Complete) {
      return await this.demoTaxiOrders4CompleteService.process(msg, ctx);
    }
    return null;
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg<DemoTaxiLocalContext> = BotCommandsProviderActionMsg<DemoTaxiLocalContext>
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    if (this.checkSpyWords({ msg })) {
      const locale = this.botCommandsToolsService.getLocale(msg, 'en');

      if (
        this.botCommandsToolsService.checkCommands(
          msg.text,
          [BotCommandsEnum.help],
          locale
        )
      ) {
        return {
          type: 'markdown',
          message: msg,
          markdown: this.botCommandsToolsService.generateHelpMessage(msg, {
            locale,
            name: this.config.title,
            descriptions: this.config.descriptions,
            usage: this.config.usage,
            category: this.config.category,
          }),
        };
      }

      if (
        this.botCommandsToolsService.checkCommands(
          msg.text,
          [getText('start'), getText('get')],
          locale
        )
      ) {
        const currentStep =
          msg.context.currentStep || DemoTaxiOrdersSteps.Start;
        if (currentStep === DemoTaxiOrdersSteps.Start) {
          return {
            newState: true,
            type: 'text',
            ...this.demoTaxiOrdersRenderService.render(locale, {
              ...msg.context,
              currentStep: DemoTaxiOrdersSteps.Direction,
            }),
            message: msg,
          };
        }
      }
    }
    return null;
  }

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg<DemoTaxiLocalContext> = BotCommandsProviderActionMsg<DemoTaxiLocalContext>
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    return await this.onMessage({
      ...msg,
      text: `${this.config.name} ${BotCommandsEnum.help}`,
    });
  }

  checkSpyWords({ msg }: { msg: BotCommandsProviderActionMsg }) {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    return this.config.spyWords.find((spyWord) =>
      this.botCommandsToolsService.checkCommands(msg.text, [spyWord], locale)
    );
  }
}
