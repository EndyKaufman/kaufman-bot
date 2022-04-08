import { Injectable } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { render } from 'mustache';
import { TranslatesService, TranslatesStorage } from 'nestjs-translates';

@Injectable()
export class BotСommandsToolsService {
  private lowerCaseTranslates?: TranslatesStorage['translates'];

  constructor(
    private readonly translatesStorage: TranslatesStorage,
    private readonly translatesService: TranslatesService
  ) {}

  generateHelpMessage({
    locale,
    name,
    descriptions,
    usage,
    contextUsage,
  }: {
    locale: string;
    name: string;
    descriptions: string;
    usage: string[];
    contextUsage?: string[];
  }) {
    const usageWithLocalized = Array.from(
      new Set(
        [
          ...usage,
          ...usage.map((u) => this.translatesService.translate(u, locale)),
        ].filter(Boolean)
      )
    );
    const contextUsageWithLocalized = contextUsage
      ? Array.from(
          new Set(
            [
              ...contextUsage,
              ...contextUsage.map((u) =>
                this.translatesService.translate(u, locale)
              ),
            ].filter(Boolean)
          )
        )
      : null;
    const replayHelpMessage = [
      name ? `__${this.translatesService.translate(name, locale)}__` : '',
      descriptions
        ? this.translatesService.translate(descriptions, locale)
        : '',
      `${this.translatesService.translate(
        getText('usage'),
        locale
      )}: ${usageWithLocalized.map((u) => `_${u}_`).join(', ')}`,
      contextUsageWithLocalized
        ? `${this.translatesService.translate(
            getText('usage with context'),
            locale
          )}: ${contextUsageWithLocalized.map((u) => `_${u}_`).join(', ')}`
        : '',
    ]
      .filter(Boolean)
      .join('\n');
    return replayHelpMessage;
  }

  private translateByLowerCase(
    key: string,
    locale?: string,
    context: unknown = {}
  ) {
    this.initLowerCaseTranslates();
    const lowerCaseKey = key.toLowerCase();
    if (!this.lowerCaseTranslates) {
      throw new Error(`lowerCaseTranslates not set`);
    }
    const value =
      (locale && this.lowerCaseTranslates?.[locale]?.[lowerCaseKey]) ||
      lowerCaseKey;
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

  checkCommands(text: string, commands: string[], locale?: string) {
    const lowerCasedText = (text || '').toLowerCase().split('ё').join('е');
    const lowerCasedCommands = commands
      .map((c) => c.toLowerCase().split('ё').join('е').split('|'))
      .reduce((acc, val) => acc.concat(val), []);
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
          lowerCasedText.includes(
            this.translateByLowerCase(command, locale).split('ё').join('е')
          ) ||
          lowerCasedText.includes(
            `/${this.translateByLowerCase(command, locale)
              .split('ё')
              .join('е')}`
          )
      )
    ) {
      return true;
    }
    return false;
  }

  checkFullmatchCommands(text: string, commands: string[], locale?: string) {
    const lowerCasedText = (text || '').toLowerCase().split('ё').join('е');
    const lowerCasedCommands = commands
      .map((c) => c.toLowerCase().split('ё').join('е').split('|'))
      .reduce((acc, val) => acc.concat(val), []);
    if (
      lowerCasedCommands.find(
        (command) =>
          lowerCasedText === command || lowerCasedText === `/${command}`
      )
    ) {
      return true;
    }
    if (
      lowerCasedCommands.find(
        (command) =>
          lowerCasedText ===
            this.translateByLowerCase(command, locale).split('ё').join('е') ||
          lowerCasedText ===
            `/${this.translateByLowerCase(command, locale)
              .split('ё')
              .join('е')}`
      )
    ) {
      return true;
    }
    return false;
  }
}
