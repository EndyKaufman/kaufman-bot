import { СommandToolsService } from '@kaufman-bot/core/server';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesService, TranslatesStorage } from 'nestjs-translates';
import {
  LanguageSwitherConfig,
  LANGUAGE_SWITHER_CONFIG,
} from '../language-swither-config/language-swither.config';
import { LanguageSwitherCommandsEnum } from '../language-swither-types/language-swither-commands';

@Injectable()
export class LanguageSwitherService {
  private readonly logger = new Logger(LanguageSwitherService.name);

  private readonly languageOfUsers: Record<number, string> = {};

  constructor(
    @Inject(LANGUAGE_SWITHER_CONFIG)
    private readonly languageSwitherConfig: LanguageSwitherConfig,
    private readonly translatesService: TranslatesService,
    private readonly translatesStorage: TranslatesStorage,
    private readonly commandToolsService: СommandToolsService
  ) {}

  async onHelp(msg) {
    return await this.onMessage({
      ...msg,
      text: `locale ${LanguageSwitherCommandsEnum.help}`,
    });
  }

  async onMessage(msg) {
    const locale =
      this.languageOfUsers[msg.from?.id] || msg.from?.language_code || null;
    if (!this.languageOfUsers[msg.from?.id]) {
      this.languageOfUsers[msg.from?.id] = locale;
    } else {
      msg.from.language_code = locale;
    }
    const spyWord = this.languageSwitherConfig.spyWords.find((spyWord) =>
      this.commandToolsService.checkCommands(msg.text, [spyWord], locale)
    );
    if (spyWord) {
      if (
        this.commandToolsService.checkCommands(
          msg.text,
          [LanguageSwitherCommandsEnum.help],
          locale
        )
      ) {
        return {
          markdown: this.commandToolsService.generateHelpMessage(
            locale,
            this.languageSwitherConfig.name,
            this.languageSwitherConfig.descriptions,
            this.languageSwitherConfig.usage
          ),
        };
      }

      const preparedText = this.commandToolsService.clearCommands(
        msg.text,
        [
          spyWord,
          ...Object.keys(LanguageSwitherCommandsEnum),
          ...(this.languageSwitherConfig.removeWords || []),
        ],
        locale
      );

      msg = await this.process(msg, locale, preparedText);

      if (msg) {
        return msg;
      }

      this.logger.warn(`Unhandled commands for text: "${msg.text}"`);
      this.logger.debug(msg);
    }
    return msg;
  }

  private async process(msg, locale: string, text: string) {
    if (
      this.commandToolsService.checkCommands(
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
        this.languageOfUsers[msg.from?.id] = 'en';
        return this.translatesService.translate(
          getText(`locale "{{locale}}" not founded, current locale: "en"`),
          locale,
          {
            locale: text.trim().toLowerCase(),
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
      this.languageOfUsers[msg.from?.id] = inputLocale || locale;

      return this.translatesService.translate(
        getText(`locale changed, current locale: "{{locale}}"`),
        locale,
        {
          locale,
        }
      );
    }
    if (
      this.commandToolsService.checkCommands(
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
    return msg;
  }
}
