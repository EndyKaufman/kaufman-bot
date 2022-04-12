import { Injectable } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { isMatch } from 'micromatch';
import { render } from 'mustache';
import { CustomInject } from 'nestjs-custom-injector';
import { TranslatesService, TranslatesStorage } from 'nestjs-translates';
import {
  BotCommandsConfig,
  BOT_COMMANDS_CONFIG,
} from '../bot-commands-config/bot-commands.config';
import { BotCommandsProviderActionMsg } from '../bot-commands-types/bot-commands-provider.interface';
import {
  BotCommandsToolsInterceptor,
  BOT_COMMANDS_TOOLS_INTERCEPTOR,
} from '../bot-commands-types/bot-commands-tools-interceptor.interface';
import { BotCommandsToolsGenerateHelpMessageOptions } from '../bot-commands-types/bot-commands-tools-types.interface';

@Injectable()
export class BotCommandsToolsService {
  @CustomInject(BOT_COMMANDS_TOOLS_INTERCEPTOR, {
    multi: true,
  })
  private botCommandsToolsInterceptors?: BotCommandsToolsInterceptor[];

  @CustomInject(BOT_COMMANDS_CONFIG)
  private botCommandsConfig?: BotCommandsConfig;

  private lowerCaseTranslates?: TranslatesStorage['translates'];

  constructor(
    private readonly translatesStorage: TranslatesStorage,
    private readonly translatesService: TranslatesService
  ) {}

  generateHelpMessage(options: BotCommandsToolsGenerateHelpMessageOptions) {
    if (
      this.botCommandsToolsInterceptors &&
      this.botCommandsToolsInterceptors.length > 0
    ) {
      for (
        let index = 0;
        index < this.botCommandsToolsInterceptors.length;
        index++
      ) {
        const botCommandsToolsInterceptor =
          this.botCommandsToolsInterceptors[index];
        if (botCommandsToolsInterceptor?.interceptHelpMessageOptions) {
          options =
            botCommandsToolsInterceptor.interceptHelpMessageOptions(options);
        }
      }
    }
    const usageWithLocalized = Array.from(
      new Set(
        [
          ...options.usage,
          ...options.usage.map((u) =>
            this.translatesService.translate(u, options.locale)
          ),
        ].filter(Boolean)
      )
    );
    const contextUsageWithLocalized = options.contextUsage
      ? Array.from(
          new Set(
            [
              ...options.contextUsage,
              ...options.contextUsage.map((u) =>
                this.translatesService.translate(u, options.locale)
              ),
            ].filter(Boolean)
          )
        )
      : null;

    const caption = options.name
      ? `__${this.translatesService.translate(options.name, options.locale)}__`
      : '';
    const descriptions = options.descriptions
      ? this.translatesService.translate(options.descriptions, options.locale)
      : '';
    const usage =
      usageWithLocalized.length > 0
        ? `${this.translatesService.translate(
            getText('usage'),
            options.locale
          )}: ${usageWithLocalized.map((u) => `_${u}_`).join(', ')}`
        : '';
    const contextUsage =
      contextUsageWithLocalized && contextUsageWithLocalized.length > 0
        ? `${this.translatesService.translate(
            getText('usage with context'),
            options.locale
          )}: ${contextUsageWithLocalized.map((u) => `_${u}_`).join(', ')}`
        : '';
    const customHelpFields = Object.keys(options.customHelpFields || {}).map(
      (customHelpFieldKey) =>
        `${this.translatesService.translate(
          customHelpFieldKey,
          options.locale
        )}: ${(options.customHelpFields?.[customHelpFieldKey] || [])
          .map((u) => `_${u}_`)
          .join(', ')}`
    );

    const replayHelpMessage = [
      caption,
      descriptions,
      usage,
      contextUsage,
      ...customHelpFields,
    ]
      .filter(Boolean)
      .join('\n');
    return replayHelpMessage;
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
    return words.join(' ').split('  ').join(' ').trim();
  }

  checkCommands(text: string, commands: string[], locale?: string) {
    const lowerCasedText = this.prepareCommandString(text.toLocaleLowerCase());
    const lowerCasedCommands = commands
      .map((c) => this.prepareCommandString(c).toLocaleLowerCase().split('|'))
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
            this.prepareCommandString(
              this.translateByLowerCase(command, locale)
            )
          ) ||
          lowerCasedText.includes(
            `/${this.prepareCommandString(
              this.translateByLowerCase(command, locale)
            )}`
          )
      )
    ) {
      return true;
    }
    return false;
  }

  checkMicromatchCommands(text: string | undefined, commands: string[]) {
    const lowerCasedText = this.prepareCommandString(
      (text || '').toLocaleLowerCase()
    );
    const lowerCasedCommands = commands
      .map((c) => this.prepareCommandString(c.toLocaleLowerCase()).split('|'))
      .reduce((acc, val) => acc.concat(val), []);
    if (
      lowerCasedCommands.find((command) =>
        isMatch(lowerCasedText, `${command}`)
      )
    ) {
      return true;
    }
    return false;
  }

  prepareHelpString(text: string) {
    return text.split('*').join('\\*');
  }

  getRandomItem<T>(items: T[]) {
    return items[Math.floor(Math.random() * items.length)];
  }

  capitalizeFirstLetter(text: string | undefined, locale: string) {
    const [first, ...rest] = (text || '').trim();
    return (first || '').toLocaleUpperCase(locale) + rest.join('');
  }

  getLocale<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg, defaultValue: string) {
    let locale = msg.from?.language_code;
    if (
      !locale ||
      !Object.keys(this.translatesStorage.translates).find((key) =>
        locale?.includes(key)
      )
    ) {
      locale = defaultValue;
    }
    return locale;
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

  private prepareCommandString(command: string): string {
    if (this.botCommandsConfig?.prepareCommandString) {
      return this.botCommandsConfig.prepareCommandString(command);
    }
    return command || '';
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
}
