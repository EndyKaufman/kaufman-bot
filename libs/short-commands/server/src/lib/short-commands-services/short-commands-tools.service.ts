import { BotCommandsToolsService } from '@kaufman-bot/core/server';
import { Injectable } from '@nestjs/common';
import { CustomInject } from 'nestjs-custom-injector';
import {
  ShortCommandsConfig,
  SHORT_COMMANDS_CONFIG,
} from '../short-commands-config/short-commands.config';

@Injectable()
export class ShortCommandsToolsService {
  @CustomInject(SHORT_COMMANDS_CONFIG)
  private shortCommandsConfig!: ShortCommandsConfig;

  constructor(
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}

  updateTextWithShortCommands(locale: string, text: string) {
    if (this.shortCommandsConfig) {
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
        text = matchedCommands[0];
      }
    }
    return text;
  }
}
