import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
  OnAfterBotCommands,
  OnBeforeBotCommands,
} from '@kaufman-bot/core-server';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInject } from 'nestjs-custom-injector';
import { TranslatesService } from 'nestjs-translates';
import {
  DebugMessagesConfig,
  DEBUG_MESSAGES_CONFIG,
} from '../debug-messages-config/debug-messages.config';
import { DebugMessagesCommandsEnum } from '../debug-messages-types/debug-messages-commands';
import {
  DebugMessagesStorageProvider,
  DEBUG_MESSAGES_STORAGE,
} from './debug-messages.storage';
import { DebugService } from './debug.service';

@Injectable()
export class DebugMessagesService
  implements BotCommandsProvider, OnBeforeBotCommands, OnAfterBotCommands
{
  handlerId = DebugMessagesService.name;

  private readonly logger = new Logger(DebugMessagesService.name);

  @CustomInject(DEBUG_MESSAGES_STORAGE)
  private readonly debugMessagesStorage!: DebugMessagesStorageProvider;

  constructor(
    @Inject(DEBUG_MESSAGES_CONFIG)
    private readonly debugMessagesConfig: DebugMessagesConfig,
    private readonly translatesService: TranslatesService,
    private readonly commandToolsService: BotCommandsToolsService,
    private readonly debugService: DebugService,
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}

  async onAfterBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    result: BotCommandsProviderActionResultType<TMsg>,
    msg: TMsg,
    ctx
  ): Promise<{ result: BotCommandsProviderActionResultType<TMsg>; msg: TMsg }> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { globalContext, ...debugData } = msg;
    this.debugService.sendDebugInfo(
      msg,
      ctx,
      debugData,
      this.debugMessagesConfig.name
    );
    return {
      msg,
      result,
    };
  }

  async onBeforeBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<TMsg> {
    const userId = this.botCommandsToolsService.getChatId(msg);
    if (userId) {
      const debugMode = await this.debugMessagesStorage.getDebugModeOfUser(
        userId
      );
      return this.debugService.setDebugMode(msg, debugMode);
    }
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
    if (
      this.botCommandsToolsService.checkSpyWords({
        msg,
        spyWords: this.debugMessagesConfig.spyWords,
      })
    ) {
      if (
        this.commandToolsService.checkCommands(
          msg.text,
          [BotCommandsEnum.help],
          msg.locale
        )
      ) {
        return {
          type: 'markdown',
          message: msg,
          markdown: this.commandToolsService.generateHelpMessage(msg, {
            locale: msg.locale,
            name: this.debugMessagesConfig.title,
            descriptions: this.debugMessagesConfig.descriptions,
            usage: this.debugMessagesConfig.usage,
            category: this.debugMessagesConfig.category,
          }),
        };
      }

      const processedMsg = await this.process(msg);

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
  >(msg: TMsg) {
    const debugMode = await this.debugMessagesStorage.getDebugModeOfUser(
      this.botCommandsToolsService.getChatId(msg)
    );
    if (
      this.commandToolsService.checkCommands(
        msg.text,
        [DebugMessagesCommandsEnum.on],
        msg.locale
      )
    ) {
      if (!debugMode) {
        await this.debugMessagesStorage.setDebugModeOfUser(
          this.botCommandsToolsService.getChatId(msg),
          true
        );
        return this.translatesService.translate(
          getText(`debug enabled`),
          msg.locale,
          {
            locale: msg.locale,
          }
        );
      } else {
        return this.translatesService.translate(
          getText(`debug already enabled`),
          msg.locale,
          {
            locale: msg.locale,
          }
        );
      }
    }
    if (
      this.commandToolsService.checkCommands(
        msg.text,
        [DebugMessagesCommandsEnum.off],
        msg.locale
      )
    ) {
      if (debugMode) {
        await this.debugMessagesStorage.setDebugModeOfUser(
          this.botCommandsToolsService.getChatId(msg),
          false
        );
        return this.translatesService.translate(
          getText(`debug disabled`),
          msg.locale,
          {
            locale: msg.locale,
          }
        );
      } else {
        return this.translatesService.translate(
          getText(`debug already disabled`),
          msg.locale,
          {
            locale: msg.locale,
          }
        );
      }
    }
    if (
      this.commandToolsService.checkCommands(
        msg.text,
        [BotCommandsEnum.state],
        msg.locale
      )
    ) {
      return this.translatesService.translate(
        getText(`debug: {{debugMode}}`),
        msg.locale,
        {
          debugMode: debugMode
            ? this.translatesService.translate(getText('enabled'), msg.locale)
            : this.translatesService.translate(getText('disabled'), msg.locale),
        }
      );
    }
    return null;
  }
}
