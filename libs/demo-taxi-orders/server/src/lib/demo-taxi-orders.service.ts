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
import { TranslatesService } from 'nestjs-translates';
import { Markup, Telegram } from 'telegraf';
import {
  DemoTaxiOrdersConfig,
  DEMO_TAXI_ORDERS_CONFIG,
} from './demo-taxi-orders.config';
import {
  CountOfPassengers,
  DemoTaxiLocalContext,
  DemoTaxiOrdersSteps,
  Direction,
  NavigationButtons,
} from './demo-taxi-orders.types';

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
    private readonly translatesService: TranslatesService,
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}

  async onContextBotCommands<
    TMsg extends BotCommandsProviderActionMsg<DemoTaxiLocalContext> = BotCommandsProviderActionMsg<DemoTaxiLocalContext>
  >(
    msg: TMsg,
    ctx: { telegram: Telegram }
  ): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    const currentStep = msg.context.currentStep;

    // console.log({ currentStep, data: msg.text });
    // console.log({
    //   data: msg.data,
    //   currentStep,
    //   contextMessageId: this.botCommandsToolsService.getContextMessageId(msg),
    // });
    if (
      currentStep &&
      Object.keys(DemoTaxiOrdersSteps).includes(currentStep) &&
      msg.data === NavigationButtons.Cancel
    ) {
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

    if (currentStep === DemoTaxiOrdersSteps.Direction) {
      const renderedData = this.render(locale, {
        ...msg.context,
        currentStep: DemoTaxiOrdersSteps.CountOfPassengers,
        direction: (Object.keys(Direction).includes(msg.data)
          ? msg.data || msg.context.direction
          : undefined) as Direction,
      });

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
    }

    if (currentStep === DemoTaxiOrdersSteps.CountOfPassengers) {
      const renderedData =
        msg.data === NavigationButtons.Prev
          ? this.render(locale, {
              ...msg.context,
              currentStep: DemoTaxiOrdersSteps.Direction,
            })
          : this.render(locale, {
              ...msg.context,
              currentStep: DemoTaxiOrdersSteps.ContactPhone,
              stateMessageId:
                this.botCommandsToolsService.getContextMessageId(msg),
              countOfPassengers: (Object.values(CountOfPassengers).find(
                (value) => +value === +msg.data
              )
                ? msg.data || msg.context.countOfPassengers
                : undefined) as CountOfPassengers,
            });

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
    }

    if (currentStep === DemoTaxiOrdersSteps.ContactPhone) {
      let renderedData = this.render(locale, {
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
        renderedData = this.render(locale, {
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
      }

      if (renderedData.context.contactPhoneMessageId !== undefined) {
        if (renderedData.context.stateMessageId) {
          await ctx.telegram.editMessageText(
            this.botCommandsToolsService.getChatId(msg),
            +renderedData.context.stateMessageId,
            undefined,
            this.render(locale, {
              currentStep: DemoTaxiOrdersSteps.ContactPhone,
            }).text
          );
        }

        return {
          type: 'text',
          ...this.render(locale, {
            ...renderedData.context,
            stateMessageId: undefined,
            contactPhoneMessageId: undefined,
          }),
          message: msg,
        };
      }
    }

    if (currentStep === DemoTaxiOrdersSteps.Finished) {
      const renderedData =
        msg.data === NavigationButtons.Prev
          ? this.render(locale, {
              ...msg.context,
              stateMessageId:
                this.botCommandsToolsService.getContextMessageId(msg),
              currentStep: DemoTaxiOrdersSteps.ContactPhone,
            })
          : this.render(locale, {
              ...msg.context,
              currentStep: DemoTaxiOrdersSteps.Finished,
            });

      await ctx.telegram.editMessageText(
        this.botCommandsToolsService.getChatId(msg),
        +this.botCommandsToolsService.getContextMessageId(msg),
        undefined,
        renderedData.text,
        msg.data === NavigationButtons.Done ? undefined : renderedData.custom
      );

      return {
        type: 'message',
        message: msg,
        context: renderedData.context,
      };
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
            ...this.render(locale, {
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

  render(locale: string, localContext: DemoTaxiLocalContext) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mainButtons: any[] = [];
    if (localContext.currentStep === DemoTaxiOrdersSteps.Direction) {
      mainButtons = [
        Markup.button.callback(
          '🌆 ' + this.getTranslatedDirectionTextByEnum(Direction.City, locale),
          Direction.City
        ),
        Markup.button.callback(
          '🏡 ' +
            this.getTranslatedDirectionTextByEnum(Direction.Village, locale),
          Direction.Village
        ),
      ];
    }

    if (localContext.currentStep === DemoTaxiOrdersSteps.CountOfPassengers) {
      mainButtons = [
        Markup.button.callback('1️⃣', CountOfPassengers.P1),
        Markup.button.callback('2️⃣', CountOfPassengers.P2),
        Markup.button.callback('3️⃣', CountOfPassengers.P3),
        Markup.button.callback('4️⃣', CountOfPassengers.P4),
      ];
    }

    if (
      localContext.currentStep === DemoTaxiOrdersSteps.Finished ||
      localContext.currentStep === DemoTaxiOrdersSteps.ContactPhone
    ) {
      mainButtons = [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let navButtons: any[] = [];
    if (localContext.currentStep === DemoTaxiOrdersSteps.Direction) {
      navButtons = [
        Markup.button.callback(
          '❌ ' + this.translatesService.translate(getText('Cancel'), locale),
          NavigationButtons.Cancel
        ),
        Markup.button.callback(
          '➡️ ' + this.translatesService.translate(getText('Next'), locale),
          NavigationButtons.Next
        ),
      ];
    }

    if (
      localContext.currentStep === DemoTaxiOrdersSteps.CountOfPassengers ||
      localContext.currentStep === DemoTaxiOrdersSteps.ContactPhone
    ) {
      navButtons = [
        Markup.button.callback(
          '❌ ' + this.translatesService.translate(getText('Cancel'), locale),
          NavigationButtons.Cancel
        ),
        Markup.button.callback(
          '⬅️ ' + this.translatesService.translate(getText('Prev'), locale),
          NavigationButtons.Prev
        ),
        Markup.button.callback(
          '➡️ ' + this.translatesService.translate(getText('Next'), locale),
          NavigationButtons.Next
        ),
      ];
    }

    if (localContext.currentStep === DemoTaxiOrdersSteps.Finished) {
      navButtons = [
        Markup.button.callback(
          '❌ ' + this.translatesService.translate(getText('Cancel'), locale),
          NavigationButtons.Cancel
        ),
        Markup.button.callback(
          '⬅️ ' + this.translatesService.translate(getText('Prev'), locale),
          NavigationButtons.Prev
        ),
        Markup.button.callback(
          '✅ ' + this.translatesService.translate(getText('Done'), locale),
          NavigationButtons.Done
        ),
      ];
    }
    return {
      text: [
        this.getFinishedInfo(locale, localContext),
        this.getDirectionInfo(localContext, locale),
        this.getCountOfPassengersInfo(localContext, locale),
        this.getContactPhone(localContext, locale),
      ]
        .filter(Boolean)
        .join('\n'),
      custom: {
        ...Markup.inlineKeyboard([mainButtons, navButtons]),
      },
      context: localContext,
      callback: async (result, context) => {
        Object.assign(context, localContext);
      },
    };
  }

  private getDirectionInfo(localContext: DemoTaxiLocalContext, locale: string) {
    let text = '';
    if (localContext.currentStep === DemoTaxiOrdersSteps.Direction) {
      if (localContext.direction) {
        text = this.translatesService.translate(
          getText(`Please choice direction (current: {value})`),
          locale
        );
      } else {
        text = this.translatesService.translate(
          getText('Please choice direction'),
          locale
        );
      }
    } else {
      if (localContext.direction) {
        text = this.translatesService.translate(
          getText(`Direction - {value}`),
          locale
        );
      }
    }
    return text.replace(
      '{value}',
      this.getTranslatedDirectionTextByEnum(localContext.direction, locale)
    );
  }

  private getFinishedInfo(locale: string, localContext: DemoTaxiLocalContext) {
    if (localContext.currentStep !== DemoTaxiOrdersSteps.Finished) {
      return '';
    }
    return [
      this.translatesService.translate(getText(`Taxi order:`), locale),
    ].join('\n');
  }

  private getContactPhone(localContext: DemoTaxiLocalContext, locale: string) {
    let text = '';
    if (localContext.currentStep === DemoTaxiOrdersSteps.ContactPhone) {
      if (localContext.contactPhone) {
        text = this.translatesService.translate(
          getText(`Please send contact phone (current: {value})`),
          locale
        );
      } else {
        text = this.translatesService.translate(
          getText('Please send contact phone'),
          locale
        );
      }
    } else {
      if (localContext.contactPhone) {
        text = this.translatesService.translate(
          getText(`Contact phone - {value}`),
          locale
        );
      }
    }
    return text.replace('{value}', localContext.contactPhone || '');
  }

  private getCountOfPassengersInfo(
    localContext: DemoTaxiLocalContext,
    locale: string
  ) {
    let text = '';
    if (localContext.currentStep === DemoTaxiOrdersSteps.CountOfPassengers) {
      if (localContext.countOfPassengers) {
        text = this.translatesService.translate(
          getText(`Please choice count of passengers (current: {value})`),
          locale
        );
      } else {
        text = this.translatesService.translate(
          getText('Please choice count of passengers'),
          locale
        );
      }
    } else {
      if (localContext.countOfPassengers) {
        text = this.translatesService.translate(
          getText(`Count of passengers - {value}`),
          locale
        );
      }
    }
    return text.replace('{value}', localContext.countOfPassengers || '');
  }

  private getTranslatedDirectionTextByEnum(
    direction: Direction | undefined,
    locale: string
  ) {
    if (direction === Direction.City) {
      return this.translatesService.translate(getText('City'), locale);
    }
    if (direction === Direction.Village) {
      return this.translatesService.translate(getText('Village'), locale);
    }
    return '';
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
