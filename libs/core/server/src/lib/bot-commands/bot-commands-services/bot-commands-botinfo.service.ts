import { Inject, Injectable } from '@nestjs/common';
import {
  BotCommandsConfig,
  BOT_COMMANDS_CONFIG,
} from '../bot-commands-config/bot-commands.config';
import { BotCommandsProviderActionResultType } from '../bot-commands-types/bot-commands-provider-action-result-type';
import {
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
} from '../bot-commands-types/bot-commands-provider.interface';
import { BotCommandsToolsService } from './bot-commands-tools.service';

@Injectable()
export class BotCommandsBotinfoService implements BotCommandsProvider {
  constructor(
    @Inject(BOT_COMMANDS_CONFIG)
    private readonly botCommandsConfig: BotCommandsConfig,
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}

  async onHelp() {
    return null;
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    if (
      this.botCommandsToolsService.checkCommands(
        msg.text,
        ['botinfo', 'bot info'],
        'en'
      )
    ) {
      if (
        msg.text.toLowerCase() !== 'botinfo' &&
        msg.text.toLowerCase() !== 'bot info'
      ) {
        return {
          type: 'stop',
          message: msg,
        };
      }
      const formatMemoryUsage = (data) =>
        `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;

      const memoryData = process.memoryUsage();

      const markdown = [
        ...(this.botCommandsToolsService.isAdmin(msg)
          ? [
              '__Server__',
              `RSS: _${formatMemoryUsage(memoryData.rss)}_`,
              `Heap total: _${formatMemoryUsage(memoryData.heapTotal)}_`,
              `Heap used: _${formatMemoryUsage(memoryData.heapUsed)}_`,
              `V8 external: _${formatMemoryUsage(memoryData.external)}_\n`,
            ]
          : []),
        `__Bot__`,
        `Version: _${this.botCommandsConfig.version || 'unknown'}_`,
        `Date: _${this.botCommandsConfig.date || 'unknown'}_`,
        `Commit: _${this.botCommandsConfig.commit || 'unknown'}_\n`,
        '__Chat__',
        `ID: _${this.botCommandsToolsService.getChatId(msg) || 'unknown'}_`,
      ]
        .join('\n')
        .split('.')
        .join('\\.')
        .split('-')
        .join('\\-');
      return {
        type: 'markdown',
        message: msg,
        markdown: markdown,
      };
    }
    return null;
  }
}
