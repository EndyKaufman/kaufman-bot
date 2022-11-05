import { Injectable } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesService } from 'nestjs-translates';
import { Markup } from 'telegraf';
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
      localContext.currentStep === DemoTaxiOrdersSteps.Complete ||
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
          '➡️ ' + this.translatesService.translate(getText('Skip'), locale),
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
          '➡️ ' + this.translatesService.translate(getText('Skip'), locale),
          NavigationButtons.Next
        ),
      ];
    }

    if (localContext.currentStep === DemoTaxiOrdersSteps.Complete) {
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
        this.getCompleteInfo(locale, localContext),
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
