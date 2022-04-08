import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotСommandsToolsService,
  OnAfterBotCommands,
  OnBeforeBotCommands,
} from '@kaufman-bot/core/server';
import { DEFAULT_LANGUAGE } from '@kaufman-bot/language-swither/server';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesService, TranslatesStorage } from 'nestjs-translates';
import {
  DebugMessagesConfig,
  DEBUG_MESSAGES_CONFIG,
} from '../debug-messages-config/debug-messages.config';
import { DebugMessagesCommandsEnum } from '../debug-messages-types/debug-messages-commands';
import { DebugMessagesStorage } from './debug-messages.storage';
import { DebugService } from './debug.service';

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
    private readonly commandToolsService: BotСommandsToolsService,
    private readonly debugService: DebugService,
    private readonly translatesStorage: TranslatesStorage
  ) {}

  async onAfterBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    result: BotCommandsProviderActionResultType<TMsg>,
    msg: TMsg,
    ctx
  ): Promise<{ result: BotCommandsProviderActionResultType<TMsg>; msg: TMsg }> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { botContext, ...debugData } = msg;
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
    const debugMode = await this.debugMessagesStorage.getDebugModeOfUser(
      msg.from?.id
    );
    return this.debugService.setDebugMode(msg, debugMode);
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
    let locale = msg.from?.language_code;
    if (
      !locale ||
      !Object.keys(this.translatesStorage.translates).find((key) =>
        locale?.includes(key)
      )
    ) {
      locale = DEFAULT_LANGUAGE;
    }
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
          markdown: this.commandToolsService.generateHelpMessage({
            locale,
            name: this.debugMessagesConfig.title,
            descriptions: this.debugMessagesConfig.descriptions,
            usage: this.debugMessagesConfig.usage,
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
