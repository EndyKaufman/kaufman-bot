import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
  OnBeforeBotCommands,
} from '@kaufman-bot/core-server';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesService } from 'nestjs-translates';
import {
  ShortCommandsConfig,
  SHORT_COMMANDS_CONFIG,
} from '../short-commands-config/short-commands.config';
import { ShortCommandsToolsService } from './short-commands-tools.service';

export const DISABLE_SHORT_COMMANDS__BEFORE_HOOK =
  'DISABLE_SHORT_COMMANDS__BEFORE_HOOK';
@Injectable()
export class ShortCommandsService
  implements BotCommandsProvider, OnBeforeBotCommands
{
  private readonly logger = new Logger(ShortCommandsService.name);

  constructor(
    @Inject(SHORT_COMMANDS_CONFIG)
    private readonly shortCommandsConfig: ShortCommandsConfig,
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly translatesService: TranslatesService,
    private readonly shortCommandsToolsService: ShortCommandsToolsService
  ) {}

  async onBeforeBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<TMsg> {
    if (msg?.botGlobalContext?.[DISABLE_SHORT_COMMANDS__BEFORE_HOOK]) {
      return msg;
    }
    if (msg) {
      msg.text = this.shortCommandsToolsService.updateTextWithShortCommands(
        this.botCommandsToolsService.getLocale(msg, 'en'),
        msg.text
      );
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
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');

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
          markdown: this.botCommandsToolsService.generateHelpMessage(msg, {
            locale,
            name: this.shortCommandsConfig.title,
            descriptions: this.shortCommandsConfig.descriptions,
            usage: this.shortCommandsConfig.usage,
            category: this.shortCommandsConfig.category,
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
          )[0] || 'en';
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
                  )}: ${this.botCommandsToolsService
                    .prepareHelpString(alias)
                    .split('|')
                    .map((u) => `_${u}_`)
                    .join(', ')}`,
                  `${this.translatesService.translate(
                    getText('command'),
                    locale
                  )}: _${this.botCommandsToolsService.prepareHelpString(
                    commands[alias]
                  )}_\n`,
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
