import { Injectable } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { InlineKeyboard } from 'grammy';
import { InlineKeyboardButton } from 'grammy/out/types.node';
import { TranslatesService } from 'nestjs-translates';
import {
  CountOfPassengers,
  DemoTaxiLocalContext,
  DemoTaxiOrdersSteps,
  Direction,
  NavigationButtons,
} from '../demo-taxi-orders.types';

@Injectable()
export class DemoTaxiOrdersRenderService {
  constructor(private readonly translatesService: TranslatesService) {}

  render(locale: string, localContext: DemoTaxiLocalContext) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mainButtons: InlineKeyboardButton[] = [];
    if (localContext.currentStep === DemoTaxiOrdersSteps.Direction) {
      mainButtons = [
        {
          text:
            '🌆 ' +
            this.getTranslatedDirectionTextByEnum(Direction.City, locale),
          callback_data: Direction.City,
        },
        {
          text:
            '🏡 ' +
            this.getTranslatedDirectionTextByEnum(Direction.Village, locale),
          callback_data: Direction.Village,
        },
      ];
    }

    if (localContext.currentStep === DemoTaxiOrdersSteps.CountOfPassengers) {
      mainButtons = [
        { text: '1️⃣', callback_data: CountOfPassengers.P1 },
        { text: '2️⃣', callback_data: CountOfPassengers.P2 },
        { text: '3️⃣', callback_data: CountOfPassengers.P3 },
        { text: '4️⃣', callback_data: CountOfPassengers.P4 },
      ];
    }

    if (
      localContext.currentStep === DemoTaxiOrdersSteps.Complete ||
      localContext.currentStep === DemoTaxiOrdersSteps.ContactPhone
    ) {
      mainButtons = [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let navButtons: InlineKeyboardButton[] = [];
    if (localContext.currentStep === DemoTaxiOrdersSteps.Direction) {
      navButtons = [
        {
          text:
            '❌ ' + this.translatesService.translate(getText('Cancel'), locale),
          callback_data: NavigationButtons.Cancel,
        },
        {
          text:
            '➡️ ' + this.translatesService.translate(getText('Skip'), locale),
          callback_data: NavigationButtons.Next,
        },
      ];
    }

    if (
      localContext.currentStep === DemoTaxiOrdersSteps.CountOfPassengers ||
      localContext.currentStep === DemoTaxiOrdersSteps.ContactPhone
    ) {
      navButtons = [
        {
          text:
            '❌ ' + this.translatesService.translate(getText('Cancel'), locale),
          callback_data: NavigationButtons.Cancel,
        },
        {
          text:
            '⬅️ ' + this.translatesService.translate(getText('Prev'), locale),
          callback_data: NavigationButtons.Prev,
        },
        {
          text:
            '➡️ ' + this.translatesService.translate(getText('Skip'), locale),
          callback_data: NavigationButtons.Next,
        },
      ];
    }

    if (localContext.currentStep === DemoTaxiOrdersSteps.Complete) {
      navButtons = [
        {
          text:
            '❌ ' + this.translatesService.translate(getText('Cancel'), locale),
          callback_data: NavigationButtons.Cancel,
        },
        {
          text:
            '⬅️ ' + this.translatesService.translate(getText('Prev'), locale),
          callback_data: NavigationButtons.Prev,
        },
        {
          text:
            '✅ ' + this.translatesService.translate(getText('Done'), locale),
          callback_data: NavigationButtons.Done,
        },
      ];
    }

    if (localContext.currentStep === DemoTaxiOrdersSteps.EnterContactPhone) {
      navButtons = [];
    }

    return {
      text: [
        this.getCompleteInfo(locale, localContext),
        this.getDirectionInfo(localContext, locale),
        this.getCountOfPassengersInfo(localContext, locale),
        this.getContactPhone(localContext, locale),
      ]
        .filter(Boolean)
        .join('\n'),
      custom: {
        reply_markup: new InlineKeyboard([mainButtons, navButtons]),
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

  private getCompleteInfo(locale: string, localContext: DemoTaxiLocalContext) {
    if (localContext.currentStep === DemoTaxiOrdersSteps.Complete) {
      return [
        this.translatesService.translate(getText(`Taxi order:`), locale),
      ].join('\n');
    }
    if (localContext.currentStep === DemoTaxiOrdersSteps.End) {
      return [
        this.translatesService.translate(
          getText(`Taxi order was completed`),
          locale
        ),
        this.translatesService.translate(getText(`Parameters:`), locale),
      ].join('\n');
    }
    return '';
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
}
