import {
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
} from '@kaufman-bot/core-server';
import { Injectable } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInject } from 'nestjs-custom-injector';
import { TranslatesService } from 'nestjs-translates';
import { Markup } from 'telegraf';
import {
  DemoTaxiOrdersSteps,
  DemoTaxiOrdersStorage,
  DEMO_TAXI_ORDERS_STORAGE,
  Direction,
} from '../demo-taxi-orders.storage';

@Injectable()
export class DirectionStepContextService {
  @CustomInject(DEMO_TAXI_ORDERS_STORAGE)
  private readonly storage!: DemoTaxiOrdersStorage;
  private readonly currentStepKey = DemoTaxiOrdersSteps.Direction;

  constructor(
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly translatesService: TranslatesService
  ) {}

  async is<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({ msg, ctx }: { msg: TMsg; ctx }) {
    const userId = this.botCommandsToolsService.getChatId(msg);
    const { state, step, stepKey, nextStepKey } =
      await this.storage.getCurrentStep(userId);
    const { request, response } = step || {};

    if (
      !response &&
      request &&
      stepKey === this.currentStepKey &&
      request.message_id === msg.message?.message_id
    ) {
      await ctx.telegram.editMessageText(
        request.chat.id,
        request.message_id,
        undefined,
        `Direction: ${msg.data}`
      );
      await this.storage.pathState({
        userId,
        state: {
          messagesMetadata: [
            {
              step: this.currentStepKey,
              response: msg,
            },
            {
              step: nextStepKey,
              request: state?.messagesMetadata?.find(
                (item) => item.step === this.currentStepKey
              )?.request,
              response: msg,
            },
          ],
        },
      });
      return true;
    } else {
      return stepKey === this.currentStepKey;
    }
  }

  async out<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({
    msg,
  }: {
    msg: TMsg;
  }): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const userId = this.botCommandsToolsService.getChatId(msg);
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    const { stepKey, state } = await this.storage.getCurrentStep(userId);
    if (stepKey !== this.currentStepKey) {
      return {
        type: 'message',
        message: msg,
        recursive: true,
      };
    }
    return {
      type: 'text',
      text: this.translatesService.translate(
        getText('Please choice direction'),
        locale
      ),
      message: msg,
      custom: {
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback(
              '🌆' + this.translatesService.translate(getText('City'), locale),
              [state?.id, Direction.City].join('/')
            ),
            Markup.button.callback(
              '🏡' +
                this.translatesService.translate(getText('Village'), locale),
              [state?.id, Direction.Village].join('/')
            ),
          ],
          [
            Markup.button.callback(
              '➡️' + this.translatesService.translate(getText('Next'), locale),
              [state?.id, 'next'].join('/')
            ),
            Markup.button.callback(
              '❌' +
                this.translatesService.translate(getText('Cancel'), locale),
              [state?.id, 'exit'].join('/')
            ),
          ],
        ]),
      },
      callback: async (request) => {
        await this.storage.pathState({
          userId,
          state: {
            messagesMetadata: [
              {
                step: this.currentStepKey,
                request,
              },
            ],
          },
        });
      },
    };
  }
}
