import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
  OnBeforeBotCommands,
} from '@kaufman-bot/core/server';
import { DEFAULT_LANGUAGE } from '@kaufman-bot/language-swither/server';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesService, TranslatesStorage } from 'nestjs-translates';
import {
  ShortCommandsConfig,
  SHORT_COMMANDS_CONFIG,
} from '../short-commands-config/short-commands.config';

@Injectable()
export class ShortCommandsService
  implements BotCommandsProvider, OnBeforeBotCommands
{
  private readonly logger = new Logger(ShortCommandsService.name);

  constructor(
    @Inject(SHORT_COMMANDS_CONFIG)
    private readonly shortCommandsConfig: ShortCommandsConfig,
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly translatesStorage: TranslatesStorage,
    private readonly translatesService: TranslatesService
  ) {}

  async onBeforeBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<TMsg> {
    const locale = msg.from.language_code;
    const text = msg.text;
    if (locale && this.shortCommandsConfig) {
      const shortCommands = this.shortCommandsConfig.commands[locale] || {};
      const matchedCommands = Object.keys(shortCommands)
        .filter((commands) =>
          this.botCommandsToolsService.checkMicromatchCommands(
            text,
            commands.split('|')
          )
        )
        .map((commands) => shortCommands[commands]);
      if (matchedCommands?.length > 0) {
        msg.text = matchedCommands[0];
      }
    }
    return msg;
  }

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    return await this.onMessage({
      ...msg,
      text: `${this.shortCommandsConfig.name} ${BotCommandsEnum.help}`,
    });
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    let locale = msg.from?.language_code;
    if (
      !locale ||
      !Object.keys(this.translatesStorage.translates).find((key) =>
        locale?.includes(key)
      )
    ) {
      locale = DEFAULT_LANGUAGE;
    }

    const spyWord = this.shortCommandsConfig.spyWords.find((spyWord) =>
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
            name: this.shortCommandsConfig.title,
            descriptions: this.shortCommandsConfig.descriptions,
            usage: this.shortCommandsConfig.usage,
          }),
        };
      }

      if (
        this.botCommandsToolsService.checkCommands(
          msg.text,
          [BotCommandsEnum.state],
          locale
        )
      ) {
        const detectedLang =
          Object.keys(this.shortCommandsConfig.commands).filter(
            (langCode) =>
              this.shortCommandsConfig.commands[langCode] && langCode === locale
          )[0] || DEFAULT_LANGUAGE;
        const commands = this.shortCommandsConfig.commands[detectedLang] || {};
        const aliases = Object.keys(commands);

        const markdown = [
          `__${this.translatesService.translate(
            getText('List of short commands:'),
            locale
          )}__`,
          ...aliases.map((alias) =>
            locale
              ? [
                  `${this.translatesService.translate(
                    getText('aliases'),
                    locale
                  )}: ${alias
                    .split('|')
                    .map((u) => `_${u}_`)
                    .join(', ')}`,
                  `${this.translatesService.translate(
                    getText('command'),
                    locale
                  )}: _${commands[alias]}_\n`,
                ].join('\n')
              : ''
          ),
        ]
          .filter(Boolean)
          .join('\n');
        return {
          type: 'markdown',
          message: msg,
          markdown,
        };
      }

      this.logger.warn(`Unhandled commands for text: "${msg.text}"`);
      this.logger.debug(msg);
    }
    return null;
  }
}
