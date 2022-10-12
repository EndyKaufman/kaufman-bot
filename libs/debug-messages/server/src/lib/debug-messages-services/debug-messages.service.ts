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
    const { botGlobalContext, ...debugData } = msg;
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
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');

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
          message: msg,
          markdown: this.commandToolsService.generateHelpMessage(msg, {
            locale,
            name: this.debugMessagesConfig.title,
            descriptions: this.debugMessagesConfig.descriptions,
            usage: this.debugMessagesConfig.usage,
            category: this.debugMessagesConfig.category,
          }),
        };
      }

      const processedMsg = await this.process(msg, locale);

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
  >(msg: TMsg, locale: string) {
    const debugMode = await this.debugMessagesStorage.getDebugModeOfUser(
      this.botCommandsToolsService.getChatId(msg)
    );
    if (
      this.commandToolsService.checkCommands(
        msg.text,
        [DebugMessagesCommandsEnum.on],
        locale
      )
    ) {
      if (!debugMode) {
        await this.debugMessagesStorage.setDebugModeOfUser(
          this.botCommandsToolsService.getChatId(msg),
          true
        );
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
        await this.debugMessagesStorage.setDebugModeOfUser(
          this.botCommandsToolsService.getChatId(msg),
          false
        );
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
        [BotCommandsEnum.state],
        locale
      )
    ) {
      return this.translatesService.translate(
        getText(`debug: {{debugMode}}`),
        locale,
        {
          debugMode: debugMode
            ? this.translatesService.translate(getText('enabled'), locale)
            : this.translatesService.translate(getText('disabled'), locale),
        }
      );
    }
    return null;
  }
}
