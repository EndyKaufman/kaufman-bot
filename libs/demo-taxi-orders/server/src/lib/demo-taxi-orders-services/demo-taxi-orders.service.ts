import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
  OnContextBotCommands,
} from '@kaufman-bot/core-server';
import { Inject, Injectable } from '@nestjs/common';
import { Context } from 'grammy';
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
import { DemoTaxiOrders4EnterContactPhoneService } from './demo-taxi-orders-4-enter-contact-phone.service';
import { DemoTaxiOrders5CompleteService } from './demo-taxi-orders-5-complete.service';
import { DemoTaxiOrdersRenderService } from './demo-taxi-orders-render.service';

export const DISABLE_DEMO_TAXI_ORDERS_COMMANDS =
  'DISABLE_DEMO_TAXI_ORDERS_COMMANDS';

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
    private readonly demoTaxiOrders4EnterContactPhoneService: DemoTaxiOrders4EnterContactPhoneService,
    private readonly demoTaxiOrders4CompleteService: DemoTaxiOrders5CompleteService
  ) {}

  async onContextBotCommands<
    TMsg extends BotCommandsProviderActionMsg<DemoTaxiLocalContext> = BotCommandsProviderActionMsg<DemoTaxiLocalContext>
  >(
    msg: TMsg,
    ctx: Context
  ): Promise<BotCommandsProviderActionResultType<TMsg>> {
    if (!this.commandsIsActive(msg)) {
      return null;
    }

    let currentStep = msg.context?.currentStep;

    if (!currentStep || currentStep === DemoTaxiOrdersSteps.End) {
      return null;
    }

    if (
      Object.keys(DemoTaxiOrdersSteps).includes(currentStep) &&
      msg.callbackQueryData === NavigationButtons.Cancel
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
      if (
        msg.context &&
        !Object.values(NavigationButtons).includes(
          msg.callbackQueryData as NavigationButtons
        ) &&
        (msg.text || msg.contact?.phone_number)
      ) {
        msg.context.currentStep = DemoTaxiOrdersSteps.EnterContactPhone;
        msg.text = msg.text || msg.contact?.phone_number;
        currentStep = msg.context?.currentStep;
      } else {
        return await this.demoTaxiOrders3ContactPhoneService.process(msg, ctx);
      }
    }

    if (currentStep === DemoTaxiOrdersSteps.EnterContactPhone) {
      return await this.demoTaxiOrders4EnterContactPhoneService.process(
        msg,
        ctx
      );
    }

    if (currentStep === DemoTaxiOrdersSteps.Complete) {
      return await this.demoTaxiOrders4CompleteService.process(msg, ctx);
    }
    return null;
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg<DemoTaxiLocalContext> = BotCommandsProviderActionMsg<DemoTaxiLocalContext>
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    if (
      this.botCommandsToolsService.checkSpyWords({
        msg,
        spyWords: this.config.spyWords,
      })
    ) {
      if (
        this.botCommandsToolsService.checkCommands(
          msg.text,
          [BotCommandsEnum.help],
          msg.locale
        )
      ) {
        return {
          type: 'markdown',
          message: msg,
          markdown: this.botCommandsToolsService.generateHelpMessage(msg, {
            locale: msg.locale,
            name: this.config.title,
            descriptions: this.config.descriptions,
            usage: this.config.usage,
            category: this.config.category,
          }),
        };
      }

      if (
        this.commandsIsActive(msg) &&
        this.botCommandsToolsService.checkCommands(
          msg.text,
          [BotCommandsEnum.start, BotCommandsEnum.get],
          msg.locale
        )
      ) {
        const currentStep =
          msg.context?.currentStep || DemoTaxiOrdersSteps.Start;
        if (currentStep === DemoTaxiOrdersSteps.Start) {
          return {
            newState: true,
            type: 'text',
            ...this.demoTaxiOrdersRenderService.render(msg.locale, {
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

  private commandsIsActive<
    TMsg extends BotCommandsProviderActionMsg<DemoTaxiLocalContext> = BotCommandsProviderActionMsg<DemoTaxiLocalContext>
  >(msg: TMsg) {
    return !msg?.globalContext?.[DISABLE_DEMO_TAXI_ORDERS_COMMANDS];
  }

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg<DemoTaxiLocalContext> = BotCommandsProviderActionMsg<DemoTaxiLocalContext>
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    return await this.onMessage({
      ...msg,
      text: `${this.config.name} ${BotCommandsEnum.help}`,
    });
  }
}
