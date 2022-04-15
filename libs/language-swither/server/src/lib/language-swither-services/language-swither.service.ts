import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
  OnBeforeBotCommands,
} from '@kaufman-bot/core/server';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesService, TranslatesStorage } from 'nestjs-translates';
import {
  LanguageSwitherConfig,
  LANGUAGE_SWITHER_CONFIG,
} from '../language-swither-config/language-swither.config';
import { LanguageSwitherCommandsEnum } from '../language-swither-types/language-swither-commands';
import { LanguageSwitherStorage } from './language-swither.storage';

@Injectable()
export class LanguageSwitherService
  implements BotCommandsProvider, OnBeforeBotCommands
{
  private readonly logger = new Logger(LanguageSwitherService.name);

  constructor(
    @Inject(LANGUAGE_SWITHER_CONFIG)
    private readonly languageSwitherConfig: LanguageSwitherConfig,
    private readonly translatesService: TranslatesService,
    private readonly translatesStorage: TranslatesStorage,
    private readonly languageSwitherStorage: LanguageSwitherStorage,
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}

  async onBeforeBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<TMsg> {
    const dbLocale = await this.languageSwitherStorage.getLanguageOfUser(
      this.botCommandsToolsService.getChatId(msg)
    );
    const detectedLocale = this.botCommandsToolsService.getLocale(msg, 'en');
    if (this.botCommandsToolsService.getChatId(msg)) {
      if (!dbLocale) {
        await this.languageSwitherStorage.setLanguageOfUser(
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
      text: `${this.languageSwitherConfig.name} ${BotCommandsEnum.help}`,
    });
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale =
      (await this.languageSwitherStorage.getLanguageOfUser(
        this.botCommandsToolsService.getChatId(msg)
      )) || this.botCommandsToolsService.getLocale(msg, 'en');
    const spyWord = this.languageSwitherConfig.spyWords.find((spyWord) =>
      this.botCommandsToolsService.checkCommands(msg.text, [spyWord], locale)
    );
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
            name: this.languageSwitherConfig.title,
            descriptions: this.languageSwitherConfig.descriptions,
            usage: this.languageSwitherConfig.usage,
            category: this.languageSwitherConfig.category,
          }),
        };
      }

      const preparedText = this.botCommandsToolsService.clearCommands(
        msg.text,
        [
          spyWord,
          ...Object.keys(LanguageSwitherCommandsEnum),
          ...(this.languageSwitherConfig.removeWords || []),
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
          LanguageSwitherCommandsEnum.set,
          LanguageSwitherCommandsEnum.change,
          LanguageSwitherCommandsEnum['quick change'],
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
          (await this.languageSwitherStorage.getLanguageOfUser(
            this.botCommandsToolsService.getChatId(msg)
          )) || this.botCommandsToolsService.getLocale(msg, 'en');
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
      msg.from.language_code = inputLocale || locale;

      await this.languageSwitherStorage.setLanguageOfUser(
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
        [LanguageSwitherCommandsEnum.my, LanguageSwitherCommandsEnum.current],
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
