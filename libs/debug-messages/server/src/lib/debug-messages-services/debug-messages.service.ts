import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotСommandsToolsService,
  OnAfterBotCommands,
  OnBeforeBotCommands,
} from '@kaufman-bot/core/server';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesService } from 'nestjs-translates';
import {
  DebugMessagesConfig,
  DEBUG_MESSAGES_CONFIG,
} from '../debug-messages-config/debug-messages.config';
import { DebugMessagesCommandsEnum } from '../debug-messages-types/debug-messages-commands';
import { DebugMessagesStorage } from './debug-messages.storage';

const DEBUG_MODE = 'debugMode';

@Injectable()
export class DebugMessagesService
  implements BotCommandsProvider, OnBeforeBotCommands, OnAfterBotCommands
{
  private readonly logger = new Logger(DebugMessagesService.name);

  constructor(
    @Inject(DEBUG_MESSAGES_CONFIG)
    private readonly debugMessagesConfig: DebugMessagesConfig,
    private readonly translatesService: TranslatesService,
    private readonly debugMessagesStorage: DebugMessagesStorage,
    private readonly commandToolsService: BotСommandsToolsService
  ) {}

  async onAfterBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg,
    TResult extends BotCommandsProviderActionResultType<TMsg> = BotCommandsProviderActionResultType<TMsg>
  >(result: TResult, msg: TMsg, ctx): Promise<{ result: TResult; msg: TMsg }> {
    const { botContext, ...debugData } = msg;
    if (botContext?.[DEBUG_MODE] && ctx) {
      ctx.reply(
        ['```', JSON.stringify(debugData, undefined, 4), '```'].join('\n'),
        {
          parse_mode: 'MarkdownV2',
        }
      );
    }
    return {
      msg,
      result,
    };
  }

  async onBeforeBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<TMsg> {
    const debugMode = await this.debugMessagesStorage.getDebugModeOfUser(
      msg.from?.id
    );
    if (!msg.botContext) {
      msg.botContext = {};
    }
    msg.botContext[DEBUG_MODE] = debugMode;
    return msg;
  }

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    return await this.onMessage({
      ...msg,
      text: `${this.debugMessagesConfig.name} ${BotCommandsEnum.help}`,
    });
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale = msg.from?.language_code || 'en';

    const spyWord = this.debugMessagesConfig.spyWords.find((spyWord) =>
      this.commandToolsService.checkCommands(msg.text, [spyWord], locale)
    );
    if (spyWord) {
      if (
        this.commandToolsService.checkCommands(
          msg.text,
          [BotCommandsEnum.help],
          locale
        )
      ) {
        return {
          type: 'markdown',
          markdown: this.commandToolsService.generateHelpMessage(
            locale,
            this.debugMessagesConfig.name,
            this.debugMessagesConfig.descriptions,
            this.debugMessagesConfig.usage
          ),
        };
      }

      const processedMsg = await this.process(msg, locale);

      if (typeof processedMsg === 'string') {
        return {
          type: 'text',
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
  >(msg: TMsg, locale: string) {
    const debugMode = await this.debugMessagesStorage.getDebugModeOfUser(
      msg.from?.id
    );
    if (
      this.commandToolsService.checkCommands(
        msg.text,
        [DebugMessagesCommandsEnum.on],
        locale
      )
    ) {
      if (!debugMode) {
        await this.debugMessagesStorage.setDebugModeOfUser(msg.from?.id, true);
        return this.translatesService.translate(
          getText(`debug enabled`),
          locale,
          {
            locale,
          }
        );
      } else {
        return this.translatesService.translate(
          getText(`debug already enabled`),
          locale,
          {
            locale,
          }
        );
      }
    }
    if (
      this.commandToolsService.checkCommands(
        msg.text,
        [DebugMessagesCommandsEnum.off],
        locale
      )
    ) {
      if (debugMode) {
        await this.debugMessagesStorage.setDebugModeOfUser(msg.from?.id, false);
        return this.translatesService.translate(
          getText(`debug disabled`),
          locale,
          {
            locale,
          }
        );
      } else {
        return this.translatesService.translate(
          getText(`debug already disabled`),
          locale,
          {
            locale,
          }
        );
      }
    }
    if (
      this.commandToolsService.checkCommands(
        msg.text,
        [DebugMessagesCommandsEnum.current],
        locale
      )
    ) {
      return this.translatesService.translate(
        getText(`debug: {{debugMode}}`),
        locale,
        { debugMode: debugMode ? 'enable' : 'disable' }
      );
    }
    return msg;
  }
}
