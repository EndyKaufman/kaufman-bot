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
  DEFAULT_LANGUAGE,
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
      msg?.chat?.id || msg?.from?.id
    );
    const detectedLocale = this.botCommandsToolsService.getLocale(
      msg,
      DEFAULT_LANGUAGE
    );
    if (msg?.chat?.id || msg?.from?.id) {
      if (!dbLocale) {
        await this.languageSwitherStorage.setLanguageOfUser(
          msg?.chat?.id || msg?.from?.id,
          detectedLocale
        );
        msg.from.language_code = detectedLocale;
      } else {
        msg.from.language_code = dbLocale;
      }
    } else {
      if (msg.from) {
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
      (await this.languageSwitherStorage.getLanguageOfUser(msg?.from?.id)) ||
      this.botCommandsToolsService.getLocale(msg, DEFAULT_LANGUAGE);
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
          markdown: this.botCommandsToolsService.generateHelpMessage({
            locale,
            name: this.languageSwitherConfig.title,
            descriptions: this.languageSwitherConfig.descriptions,
            usage: this.languageSwitherConfig.usage,
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
            msg?.chat?.id || msg?.from?.id
          )) || this.botCommandsToolsService.getLocale(msg, DEFAULT_LANGUAGE);
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
        msg?.chat?.id || msg?.from?.id,
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
