import { Injectable } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { render } from 'mustache';
import { TranslatesService, TranslatesStorage } from 'nestjs-translates';

@Injectable()
export class СommandToolsService {
  private lowerCaseTranslates?: TranslatesStorage['translates'];

  constructor(
    private readonly translatesStorage: TranslatesStorage,
    private readonly translatesService: TranslatesService
  ) {}

  generateHelpMessage(
    locale: string,
    name: string,
    descriptions: string,
    usage: string[]
  ) {
    const usageWithLocalized = Array.from(
      new Set([
        ...usage,
        ...usage.map((u) => this.translatesService.translate(u, locale)),
      ])
    );
    const replayHelpMessage = [
      `__${this.translatesService.translate(name, locale)}__`,
      this.translatesService.translate(descriptions, locale),
      `${this.translatesService.translate(
        getText('usage'),
        locale
      )}: ${usageWithLocalized.map((u) => `_${u}_`).join(', ')}`,
    ].join('\n');
    return replayHelpMessage;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private translateByLowerCase(key: string, locale: string, context: any = {}) {
    this.initLowerCaseTranslates();
    const lowerCaseKey = key.toLowerCase();
    if (!this.lowerCaseTranslates) {
      throw new Error(`lowerCaseTranslates not set`);
    }
    const value =
      this.lowerCaseTranslates?.[locale]?.[lowerCaseKey] || lowerCaseKey;
    return value ? render(value, context) : value;
  }

  private initLowerCaseTranslates() {
    if (!this.lowerCaseTranslates) {
      this.lowerCaseTranslates = {};
      Object.keys(this.translatesStorage.translates).forEach(
        (translateLocale) => {
          if (!this.lowerCaseTranslates) {
            throw new Error(`lowerCaseTranslates not set`);
          }
          this.lowerCaseTranslates[translateLocale] = {};
          Object.keys(
            this.translatesStorage.translates[translateLocale]
          ).forEach((translateKey) => {
            if (!this.lowerCaseTranslates?.[translateLocale]) {
              throw new Error(
                `lowerCaseTranslates by locale "${translateLocale}" not set`
              );
            }
            this.lowerCaseTranslates[translateLocale][
              translateKey.toLowerCase()
            ] =
              this.translatesStorage.translates[translateLocale][
                translateKey
              ].toLowerCase();
          });
        }
      );
    }
  }

  clearCommands(text: string, commands: string[], locale: string) {
    const words = text.split(' ');
    const lowerCasedWords = words.map((c) => c.toLowerCase());
    const lowerCasedCommands = commands.map((c) => c.toLowerCase());
    lowerCasedCommands.forEach((command) => {
      lowerCasedWords.forEach((word, wordIndex) => {
        if (command === word) {
          words[wordIndex] = '';
        }
        if (`/${command}` === word) {
          words[wordIndex] = '';
        }
        if (this.translateByLowerCase(command, locale) === word) {
          words[wordIndex] = '';
        }
        if (`/${this.translateByLowerCase(command, locale)}` === word) {
          words[wordIndex] = '';
        }
      });
    });
    return words.join(' ').split('  ').join(' ');
  }

  checkCommands(text: string, commands: string[], locale: string) {
    const lowerCasedText = (text || '').toLowerCase();
    const lowerCasedCommands = commands.map((c) => c.toLowerCase());
    if (
      lowerCasedCommands.find(
        (command) =>
          lowerCasedText.includes(command) ||
          lowerCasedText.includes(`/${command}`)
      )
    ) {
      return true;
    }
    if (
      lowerCasedCommands.find(
        (command) =>
          lowerCasedText.includes(this.translateByLowerCase(command, locale)) ||
          lowerCasedText.includes(
            `/${this.translateByLowerCase(command, locale)}`
          )
      )
    ) {
      return true;
    }
    return false;
  }
}
