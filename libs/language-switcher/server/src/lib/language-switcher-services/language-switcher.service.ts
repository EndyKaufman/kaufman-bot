import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
  DEFAULT_LOCALE,
  OnBeforeBotCommands,
} from '@kaufman-bot/core-server';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInject } from 'nestjs-custom-injector';
import { TranslatesService, TranslatesStorage } from 'nestjs-translates';
import {
  LanguageSwitcherConfig,
  LANGUAGE_SWITCHER_CONFIG,
} from '../language-switcher-config/language-switcher.config';
import { LanguageSwitcherCommandsEnum } from '../language-switcher-types/language-switcher-commands';
import {
  LanguageSwitcherStorage,
  LANGUAGE_SWITCHER_STORAGE,
} from './language-switcher.storage';

@Injectable()
export class LanguageSwitcherService
  implements BotCommandsProvider, OnBeforeBotCommands
{
  handlerId = LanguageSwitcherService.name;

  private readonly logger = new Logger(LanguageSwitcherService.name);

  @CustomInject(LANGUAGE_SWITCHER_STORAGE)
  private readonly languageSwitcherStorage!: LanguageSwitcherStorage;

  constructor(
    @Inject(LANGUAGE_SWITCHER_CONFIG)
    private readonly languageSwitcherConfig: LanguageSwitcherConfig,
    private readonly translatesService: TranslatesService,
    private readonly translatesStorage: TranslatesStorage,
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}

  async onBeforeBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<TMsg> {
    const dbLocale = await this.languageSwitcherStorage.getLanguageOfUser(
      this.botCommandsToolsService.getChatId(msg)
    );
    const detectedLocale = this.botCommandsToolsService.getLocale(msg, DEFAULT_LOCALE);
    if (this.botCommandsToolsService.getChatId(msg)) {
      if (!dbLocale) {
        await this.languageSwitcherStorage.setLanguageOfUser(
          this.botCommandsToolsService.getChatId(msg),
          detectedLocale
        );
        if (msg?.from) {
          msg.from.language_code = detectedLocale;
        }
      } else {
        if (msg?.from) {
          msg.from.language_code = dbLocale;
        }
      }
    } else {
      if (msg?.from) {
        msg.from.language_code = detectedLocale;
      }
    }
    return msg;
  }

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    return await this.onMessage({
      ...msg,
      text: `${this.languageSwitcherConfig.name} ${BotCommandsEnum.help}`,
    });
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale =
      (await this.languageSwitcherStorage.getLanguageOfUser(
        this.botCommandsToolsService.getChatId(msg)
      )) || this.botCommandsToolsService.getLocale(msg, DEFAULT_LOCALE);
    const spyWord = this.botCommandsToolsService.checkSpyWords({
      msg,
      spyWords: this.languageSwitcherConfig.spyWords,
    });
    if (spyWord) {
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
            name: this.languageSwitcherConfig.title,
            descriptions: this.languageSwitcherConfig.descriptions,
            usage: this.languageSwitcherConfig.usage,
            category: this.languageSwitcherConfig.category,
          }),
        };
      }

      const preparedText = this.botCommandsToolsService.clearCommands(
        msg.text,
        [
          spyWord,
          ...Object.keys(LanguageSwitcherCommandsEnum),
          ...(this.languageSwitcherConfig.removeWords || []),
        ],
        locale
      );

      const processedMsg = await this.process(msg, locale, preparedText);

      if (typeof processedMsg === 'string') {
        return {
          type: 'text',
          message: msg,
          text: processedMsg,
        };
      }
      if (processedMsg) {
        return { type: 'message', message: processedMsg };
      }

      this.logger.warn(`Unhandled commands for text: "${msg.text}"`);
      this.logger.debug(msg);
    }
    return null;
  }

  private async process<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg, locale: string, text: string) {
    if (
      this.botCommandsToolsService.checkCommands(
        msg.text,
        [
          LanguageSwitcherCommandsEnum.set,
          LanguageSwitcherCommandsEnum.change,
          LanguageSwitcherCommandsEnum['quick change'],
        ],
        locale
      )
    ) {
      if (
        !Object.keys(this.translatesStorage.translates)
          .map((key) => key.toLowerCase())
          .includes(text.trim().toLowerCase())
      ) {
        const currentLocale =
          (await this.languageSwitcherStorage.getLanguageOfUser(
            this.botCommandsToolsService.getChatId(msg)
          )) || this.botCommandsToolsService.getLocale(msg, DEFAULT_LOCALE);
        return this.translatesService.translate(
          getText(
            `locale "{{locale}}" not founded, current locale: "{{currentLocale}}"`
          ),
          currentLocale,
          {
            locale: text.trim().toLowerCase(),
            currentLocale,
          }
        );
      }
      const inputLocale =
        Object.keys(this.translatesStorage.translates).find((lang) =>
          text
            .split(' ')
            .find((key) => key.toLowerCase() === lang.toLowerCase())
        ) || locale;
      locale = inputLocale || locale;
      if (msg.from) {
        msg.from.language_code = inputLocale || locale;
      }

      await this.languageSwitcherStorage.setLanguageOfUser(
        this.botCommandsToolsService.getChatId(msg),
        inputLocale || locale
      );

      return this.translatesService.translate(
        getText(`locale changed, current locale: "{{locale}}"`),
        locale,
        {
          locale,
        }
      );
    }
    if (
      this.botCommandsToolsService.checkCommands(
        msg.text,
        [LanguageSwitcherCommandsEnum.my, LanguageSwitcherCommandsEnum.current],
        locale
      )
    ) {
      return this.translatesService.translate(
        getText(`you locale: {{locale}}`),
        locale,
        { locale }
      );
    }
    return null;
  }
}
