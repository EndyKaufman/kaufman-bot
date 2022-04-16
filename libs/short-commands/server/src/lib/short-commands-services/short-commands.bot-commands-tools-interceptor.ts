import {
  BotCommandsToolsGenerateHelpMessageOptions,
  BotCommandsToolsInterceptor,
  BotCommandsToolsService,
} from '@kaufman-bot/core/server';
import { Inject, Injectable } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesService } from 'nestjs-translates';
import {
  ShortCommandsConfig,
  SHORT_COMMANDS_CONFIG,
} from '../short-commands-config/short-commands.config';
@Injectable()
export class ShortCommandsBotCommandsToolsInterceptor
  implements BotCommandsToolsInterceptor
{
  constructor(
    @Inject(SHORT_COMMANDS_CONFIG)
    private readonly shortCommandsConfig: ShortCommandsConfig,
    private readonly translatesService: TranslatesService,
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}

  interceptHelpMessageOptions(
    options: BotCommandsToolsGenerateHelpMessageOptions
  ) {
    const detectedLang =
      Object.keys(this.shortCommandsConfig.commands).filter(
        (langCode) =>
          this.shortCommandsConfig.commands[langCode] &&
          langCode === options.locale
      )[0] || 'en';
    const commands = this.shortCommandsConfig.commands[detectedLang] || {};
    const aliases = Object.keys(commands);

    const title = this.translatesService.translate(
      getText('aliases'),
      options.locale
    );
    const value = aliases
      .filter((alias) => options.usage.includes(commands[alias]))
      .map(
        (alias) =>
          `${this.botCommandsToolsService.prepareHelpString(
            commands[alias]
          )} \\- ${this.botCommandsToolsService
            .prepareHelpString(alias)
            .split('|')
            .join(', ')}`
      );

    if (!options.customHelpFields) {
      options.customHelpFields = {};
    }
    if (value.length > 0) {
      options.customHelpFields[title] = value;
    }

    return options;
  }
}
