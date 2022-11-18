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
  handlerId = ShortCommandsService.name;

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
    if (msg?.globalContext?.[DISABLE_SHORT_COMMANDS__BEFORE_HOOK]) {
      return msg;
    }
    if (msg?.text) {
      msg.text = this.shortCommandsToolsService.updateTextWithShortCommands(
        msg.locale,
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
    if (
      this.botCommandsToolsService.checkSpyWords({
        msg,
        spyWords: this.shortCommandsConfig.spyWords,
      })
    ) {
      if (
        this.botCommandsToolsService.checkCommands(
          msg.text,
          [BotCommandsEnum.help],
          msg.locale
        )
      ) {
        return {
          type: 'markdown',
          message: msg,
          markdown: this.botCommandsToolsService.generateHelpMessage(msg, {
            locale: msg.locale,
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
          msg.locale
        )
      ) {
        const detectedLang =
          Object.keys(this.shortCommandsConfig.commands).filter(
            (langCode) =>
              this.shortCommandsConfig.commands[langCode] &&
              langCode === msg.locale
          )[0] || DEFAULT_LOCALE;
        const commands = this.shortCommandsConfig.commands[detectedLang] || {};
        const aliases = Object.keys(commands);

        const markdown = [
          `__${this.translatesService.translate(
            getText('List of short commands:'),
            msg.locale
          )}__`,
          ...aliases.map((alias) =>
            msg.locale
              ? [
                  `${this.translatesService.translate(
                    getText('aliases'),
                    msg.locale
                  )}: ${alias
                    .split('|')
                    .map(
                      (u) =>
                        `_${this.botCommandsToolsService.prepareHelpString(u)}_`
                    )
                    .join(', ')}`,
                  `${this.translatesService.translate(
                    getText('command'),
                    msg.locale
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
