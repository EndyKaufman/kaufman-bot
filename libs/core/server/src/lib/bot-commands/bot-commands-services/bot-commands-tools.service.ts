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
import { LATEST_MESSAGE_ID } from '../bot-commands-constants/bot-commands.constants';
import { BotCommandsCategory } from '../bot-commands-types/bot-commands-enum';
import { BotCommandsProviderActionMsg } from '../bot-commands-types/bot-commands-provider-action-msg.interface';
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
  private botCommandsToolsInterceptors!: BotCommandsToolsInterceptor[];

  @CustomInject(BOT_COMMANDS_CONFIG)
  private botCommandsConfig!: BotCommandsConfig;

  private lowerCaseTranslates?: TranslatesStorage['translates'];

  constructor(
    private readonly translatesStorage: TranslatesStorage,
    private readonly translatesService: TranslatesService
  ) {}

  getReplyMessageId<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg) {
    const id = msg?.reply_to_message?.message_id || msg?.message?.message_id;
    return id ? String(id) : undefined;
  }

  getContextMessageId<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg) {
    const id =
      msg?.reply_to_message?.message_id ||
      msg?.message?.message_id ||
      msg?.message_id;
    return id ? String(id) : LATEST_MESSAGE_ID;
  }

  getMessageId<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  >(msg: TMsg) {
    return LATEST_MESSAGE_ID;
  }

  getChatId<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg) {
    return String(
      msg?.reply_to_message?.chat?.id ||
        msg?.message?.chat?.id ||
        msg?.chat?.id ||
        msg?.from?.id
    );
  }

  isAdmin<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg) {
    const admins =
      this.botCommandsConfig?.admins.map((admin) =>
        String(admin).trim().toLocaleLowerCase()
      ) || [];
    return (
      admins.includes(msg?.reply_to_message?.chat?.id.toString() || '') ||
      admins.includes(msg?.message?.chat?.id.toString() || '') ||
      admins.includes(msg?.chat?.id.toString() || '') ||
      admins.includes(msg?.from?.id.toString() || '')
    );
  }

  generateHelpMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg, options: BotCommandsToolsGenerateHelpMessageOptions) {
    const isAdmin = this.isAdmin(msg);

    if (options.category === BotCommandsCategory.system && !isAdmin) {
      return '';
    }

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
      ? `__${this.translatesService.translate(options.name, options.locale)}${
          !isAdmin && options.category === BotCommandsCategory.user
            ? ''
            : ` \\(${this.translatesService.translate(
                options.category,
                options.locale
              )}\\)`
        }__`
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

  clearCommands(text: string | undefined, commands: string[], locale: string) {
    const words = (text || '').split(' ');
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
        if (
          this.prepareCommandString(
            this.translateByLowerCase(command, locale)
          ) === this.prepareCommandString(word)
        ) {
          words[wordIndex] = '';
        }
        if (
          `/${this.prepareCommandString(
            this.translateByLowerCase(command, locale)
          )}` === this.prepareCommandString(word)
        ) {
          words[wordIndex] = '';
        }
      });
    });
    return words.join(' ').split('  ').join(' ').trim();
  }

  checkCommands(text: string | undefined, commands: string[], locale?: string) {
    const lowerCasedText = this.prepareCommandString(
      (text || '').toLocaleLowerCase()
    );
    const lowerCasedTextArray = lowerCasedText.split(' ');
    const lowerCasedCommands = commands
      .map((c) => this.prepareCommandString(c).toLocaleLowerCase().split('|'))
      .reduce((acc, val) => acc.concat(val), []);
    if (
      lowerCasedCommands.find(
        (command) =>
          lowerCasedTextArray.find(
            (lowerCasedTextArrayItem) => lowerCasedTextArrayItem === command
          ) ||
          lowerCasedTextArray.find(
            (lowerCasedTextArrayItem) =>
              lowerCasedTextArrayItem === `/${command}`
          )
      )
    ) {
      return true;
    }
    if (
      lowerCasedCommands.find(
        (command) =>
          lowerCasedTextArray.find(
            (lowerCasedTextArrayItem) =>
              lowerCasedTextArrayItem ===
              this.prepareCommandString(
                this.translateByLowerCase(command, locale)
              )
          ) ||
          lowerCasedTextArray.find(
            (lowerCasedTextArrayItem) =>
              lowerCasedTextArrayItem ===
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

  prepareHelpString(text: string | undefined) {
    return (text || '')
      .replace(/_/g, '\\_')
      .replace(/\*/g, '\\*')
      .replace(/\[/g, '\\[')
      .replace(/]/g, '\\]')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .replace(/~/g, '\\~')
      .replace(/`/g, '\\`')
      .replace(/>/g, '\\>')
      .replace(/#/g, '\\#')
      .replace(/\+/g, '\\+')
      .replace(/-/g, '\\-')
      .replace(/=/g, '\\=')
      .replace(/\|/g, '\\|')
      .replace(/{/g, '\\{')
      .replace(/}/g, '\\}')
      .replace(/\./g, '\\.')
      .replace(/!/g, '\\!');
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
    let locale = msg?.from?.language_code;
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
