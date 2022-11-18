/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable, Logger } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { Context } from 'grammy';
import { CustomInject } from 'nestjs-custom-injector';
import {
  BotCommandsConfig,
  BOT_COMMANDS_CONFIG,
} from '../bot-commands-config/bot-commands.config';
import {
  DEFAULT_LOCALE,
  DEFAULT_MAX_RECURSIVE_DEPTH,
} from '../bot-commands-constants/bot-commands.constants';
import { BotCommandsEnum } from '../bot-commands-types/bot-commands-enum';
import { BotCommandsProviderActionMsg } from '../bot-commands-types/bot-commands-provider-action-msg.interface';
import { BotCommandsProviderActionResultType } from '../bot-commands-types/bot-commands-provider-action-result-type.interface';
import {
  BotCommandsProvider,
  BotCommandsProviderActionContext,
  BOT_COMMANDS_PROVIDER,
} from '../bot-commands-types/bot-commands-provider.interface';
import {
  BotCommandsStorageProvider,
  BOT_COMMANDS_STORAGE,
} from '../bot-commands-types/bot-commands-storage.provider';
import { OnAfterBotCommands } from '../bot-commands-types/on-after-bot-commands.interface';
import { OnBeforeBotCommands } from '../bot-commands-types/on-before-bot-commands.interface';
import { OnContextBotCommands } from '../bot-commands-types/on-context-bot-commands.interface';
import { BotCommandsToolsService } from './bot-commands-tools.service';

@Injectable()
export class BotCommandsService {
  private logger = new Logger(BotCommandsService.name);

  @CustomInject(BOT_COMMANDS_STORAGE)
  private botCommandsStorage!: BotCommandsStorageProvider<{
    context?: Record<string, unknown>;
  }>;

  @CustomInject(BOT_COMMANDS_PROVIDER, {
    multi: true,
    providersFactory: (items) => {
      const len = items.length;
      for (let i = 0; i < len; i++) {
        if (!items[i].handlerId) {
          items[i].handlerId = `botCommandHandler#${i.toString()}`;
        }
      }
      return items;
    },
  })
  private botCommandsProviders!: (BotCommandsProvider &
    Partial<OnBeforeBotCommands> &
    Partial<OnAfterBotCommands> &
    Partial<OnContextBotCommands>)[];

  @CustomInject(BOT_COMMANDS_CONFIG)
  private botCommandsConfig!: BotCommandsConfig;

  constructor(
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}

  async start(ctx: Context) {
    await this.process(ctx);
  }

  async process(ctx: Context, defaultHandler?: () => Promise<unknown>) {
    let msg: BotCommandsProviderActionMsg =
      ctx.message! as BotCommandsProviderActionMsg;
    if (!msg && ctx.callbackQuery) {
      msg = {
        message: ctx.message,
        ...ctx.callbackQuery.message!,
        callbackQueryData: ctx.callbackQuery.data,
        locale: DEFAULT_LOCALE,
      };
    }
    if (!msg) {
      try {
        this.logger.debug(JSON.stringify(ctx));
      } catch (error) {
        this.logger.debug(ctx);
      }
      return;
    }
    if (!msg.globalContext) {
      msg.globalContext = {};
    }

    if (this.botCommandsConfig.defaultGlobalContext) {
      Object.assign(
        msg.globalContext,
        this.botCommandsConfig.defaultGlobalContext
      );
    }

    let recursiveDepth = 1;
    while (
      recursiveDepth > 0 &&
      recursiveDepth <=
        (this.botCommandsConfig?.maxRecursiveDepth ||
          DEFAULT_MAX_RECURSIVE_DEPTH)
    ) {
      const result = await this.processHooks(msg, ctx, defaultHandler);

      if (result?.type === 'message') {
        msg = result.message;
      }

      const contextMessageId =
        this.botCommandsToolsService.getContextMessageId(msg);

      const userId = this.botCommandsToolsService.getChatId(msg);

      const messageId =
        this.botCommandsToolsService.geConstantLatestMessageId(msg);
      const replyResultMessageId =
        this.botCommandsToolsService.getReplyMessageId(msg);

      if (result?.type === 'markdown' || result?.type === 'text') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let replyResult: any;

        if (result?.type === 'markdown') {
          replyResult = await ctx.reply(result.markdown, {
            parse_mode: 'MarkdownV2',
            ...result.custom,
          });
        }
        if (result?.type === 'text') {
          replyResult = await ctx.reply(result.text, {
            ...result.custom,
          });
        }

        const state =
          (await this.botCommandsStorage.getState(userId, messageId)) ||
          undefined;

        if (result.callback) {
          const context = state?.context || {};
          await result.callback(replyResult, context);
          if (state) {
            state.context = context;
          }
        }

        if (replyResultMessageId !== contextMessageId) {
          await this.botCommandsStorage.patchState(userId, messageId, {
            ...(state || {}),
            response: { type: 'message', message: replyResult },
          });
        }
      }

      if (result?.type !== 'stop' && result?.recursive) {
        recursiveDepth++;
      } else {
        recursiveDepth = 0;
      }
    }
  }

  private async processHelpHook<TMsg extends BotCommandsProviderActionMsg>(
    msg: TMsg,
    ctx: BotCommandsProviderActionContext
  ): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const allResults: string[] = [];
    const len = this.botCommandsProviders.length;

    let allContext: Record<string, unknown> = {};

    for (let i = 0; i < len; i++) {
      const botCommandsProvider = this.botCommandsProviders[i];

      const result = await botCommandsProvider.onHelp(
        {
          ...msg,
          handlerId: botCommandsProvider.handlerId,
          context: msg?.context || {},
        },
        ctx
      );

      if (result !== null && result.type === 'text') {
        allResults.push(result.text);
        allContext = { ...allContext, ...(result.context || {}) };
      }

      if (result !== null && result.type === 'markdown') {
        allResults.push(result.markdown);
        allContext = { ...allContext, ...(result.context || {}) };
      }
    }
    return {
      type: 'markdown',
      message: msg,
      markdown: allResults.join('\n\n'),
      context: allContext,
    };
  }

  private async processHooks<TMsg extends BotCommandsProviderActionMsg>(
    msg: TMsg,
    ctx: BotCommandsProviderActionContext,
    defaultHandler?: () => Promise<unknown>
  ): Promise<BotCommandsProviderActionResultType<TMsg>> {
    let result: BotCommandsProviderActionResultType<TMsg> = null;
    let locale = this.botCommandsToolsService.getLocale(msg, DEFAULT_LOCALE);
    msg.locale = locale;

    await this.checkMessageToReplayAndSaveLatestAsNumericStateAndSetLatestToReplayNumericState<TMsg>(
      msg
    );

    msg = await this.processOnBeforeBotCommands(msg, ctx);

    locale = this.botCommandsToolsService.getLocale(msg, DEFAULT_LOCALE);
    msg.locale = locale;

    if (!msg?.handlerStop) {
      result = await this.processOnMessage(result, msg, ctx);
    }

    if (!msg?.handlerStop) {
      result = await this.processOnContext(result, msg, ctx);
    }

    if (msg?.handlerStop) {
      return { type: 'stop', message: msg };
    }

    if (
      result === null &&
      this.botCommandsToolsService.checkCommands(
        msg.text,
        [BotCommandsEnum.help],
        msg.from?.language_code
      )
    ) {
      return this.processHelpHook(msg, ctx);
    }

    if (
      result === null &&
      this.botCommandsToolsService.checkCommands(
        msg.text,
        [BotCommandsEnum.meet, BotCommandsEnum.start],
        msg.from?.language_code
      )
    ) {
      return {
        type: 'markdown',
        message: msg,
        markdown: this.botCommandsToolsService.prepareHelpString(
          this.botCommandsToolsService.getRandomItem(
            this.botCommandsConfig.botMeetingInformation
              ? this.botCommandsConfig.botMeetingInformation[
                  msg.from?.language_code || DEFAULT_LOCALE
                ]
              : [
                  getText(`Hello! I'm Robot 😉`),
                  getText('Hello!'),
                  getText('Hello 🖖'),
                ]
          )
        ),
      };
    }

    const afterBotCommand = await this.processOnAfterBotCommands(
      result,
      msg,
      ctx,
      defaultHandler
    );

    if (defaultHandler) {
      await defaultHandler();
    }

    return afterBotCommand.result;
  }

  private async checkMessageToReplayAndSaveLatestAsNumericStateAndSetLatestToReplayNumericState<
    TMsg extends BotCommandsProviderActionMsg
  >(msg: TMsg) {
    const chatId = this.botCommandsToolsService.getChatId(msg);
    const messageId =
      this.botCommandsToolsService.geConstantLatestMessageId(msg);
    const replyMessageId = this.botCommandsToolsService.getReplyMessageId(msg);

    const currentState = await this.botCommandsStorage.getState(
      chatId,
      messageId
    );

    if (replyMessageId) {
      const stateByUsedMessage =
        await this.botCommandsStorage.getStateByUsedMessageId(
          chatId,
          replyMessageId
        );

      if ((stateByUsedMessage?.usedMessageIds || []).includes(replyMessageId)) {
        if (currentState) {
          const usedMessageId = currentState?.usedMessageIds[0];
          if (usedMessageId && usedMessageId.length > 0) {
            await this.botCommandsStorage.patchState(chatId, usedMessageId, {
              ...currentState,
            });
            await this.botCommandsStorage.delState(chatId, messageId);
            await this.botCommandsStorage.patchState(chatId, messageId, {
              ...stateByUsedMessage,
            });
          }
        }
      }
    }
  }

  private async processOnBeforeBotCommands<TMsg extends BotCommandsProviderActionMsg>(
    msg: TMsg,
    ctx?: BotCommandsProviderActionContext
  ): Promise<TMsg> {
    const len = this.botCommandsProviders.length;
    for (let i = 0; i < len; i++) {
      const botCommandsProvider = this.botCommandsProviders[i];
      if (botCommandsProvider.onBeforeBotCommands && !msg?.handlerStop) {
        msg = await botCommandsProvider.onBeforeBotCommands(
          {
            ...msg,
            handlerId: botCommandsProvider.handlerId,
            context: msg?.context || {},
          },
          ctx
        );
      }
    }
    return msg;
  }

  private async processOnAfterBotCommands<TMsg extends BotCommandsProviderActionMsg>(
    result: BotCommandsProviderActionResultType<TMsg>,
    msg: TMsg,
    ctx?: BotCommandsProviderActionContext,
    defaultHandler?: () => Promise<unknown>
  ): Promise<{ result: BotCommandsProviderActionResultType<TMsg>; msg: TMsg }> {
    const len = this.botCommandsProviders.length;
    for (let i = 0; i < len; i++) {
      const botCommandsProvider = this.botCommandsProviders[i];
      if (botCommandsProvider.onAfterBotCommands) {
        const afterBotCommand =
          await botCommandsProvider.onAfterBotCommands<TMsg>(
            result,
            {
              ...msg,
              handlerId: botCommandsProvider.handlerId,
              context: msg?.context || {},
            },
            ctx,
            defaultHandler
          );
        result = afterBotCommand.result;
        msg = afterBotCommand.msg;
      }
    }
    return { result, msg };
  }

  private async processOnMessage<TMsg extends BotCommandsProviderActionMsg>(
    result: BotCommandsProviderActionResultType<TMsg>,
    msg: TMsg,
    ctx: BotCommandsProviderActionContext
  ) {
    if (!msg) {
      return result;
    }
    const len = this.botCommandsProviders.length;
    for (let i = 0; i < len; i++) {
      const botCommandsProvider = this.botCommandsProviders[i];
      if (!result && !msg?.handlerStop) {
        msg.handlerId = botCommandsProvider.handlerId;
        msg.context = msg?.context || {};
        result = await botCommandsProvider.onMessage(msg, ctx);

        if (result) {
          msg.handlerId = botCommandsProvider.handlerId;
        }
      }
    }
    return result;
  }

  private async processOnContext<TMsg extends BotCommandsProviderActionMsg>(
    result: BotCommandsProviderActionResultType<TMsg>,
    msg: TMsg,
    ctx: BotCommandsProviderActionContext
  ) {
    if (!msg) {
      return result;
    }
    const chatId = this.botCommandsToolsService.getChatId(msg);
    const messageId =
      this.botCommandsToolsService.geConstantLatestMessageId(msg);

    let state = await this.botCommandsStorage.getState(chatId, messageId);

    if (state && result === null) {
      const len = this.botCommandsProviders.length;
      for (let i = 0; i < len; i++) {
        const botCommandsProvider = this.botCommandsProviders[i];
        state = await this.botCommandsStorage.getState(chatId, messageId);

        if (
          !result &&
          state?.handlerId === botCommandsProvider.handlerId &&
          botCommandsProvider.onContextBotCommands &&
          !msg?.handlerStop
        ) {
          msg.context = state?.context || {};

          result = await botCommandsProvider.onContextBotCommands(
            {
              ...msg,
              handlerId: botCommandsProvider.handlerId,
              context: msg?.context || {},
            },
            ctx
          );

          if (result) {
            msg.handlerId = botCommandsProvider.handlerId;
          }
        }
      }
    }

    if (result) {
      await this.saveLatestStateIfCurrentResultSendNewStateOptionsAndClearLatestState<TMsg>(
        result,
        msg
      );

      await this.saveLatestStateOnChangeSuccessCommandHandlerIdAndClearLatestState(
        chatId,
        messageId,
        msg
      );

      await this.saveSuccessProcessOnContext<TMsg>(
        chatId,
        messageId,
        msg,
        result
      );
    }
    return result;
  }

  private async saveLatestStateIfCurrentResultSendNewStateOptionsAndClearLatestState<
    TMsg extends BotCommandsProviderActionMsg
  >(result: BotCommandsProviderActionResultType<TMsg>, msg: TMsg) {
    if (result?.newState) {
      const chatId = this.botCommandsToolsService.getChatId(msg);
      const messageId =
        this.botCommandsToolsService.geConstantLatestMessageId(msg);

      const currentState = await this.botCommandsStorage.getState(
        chatId,
        messageId
      );
      if (currentState) {
        const usedMessageId = currentState?.usedMessageIds[0];
        if (usedMessageId) {
          await this.botCommandsStorage.patchState(chatId, usedMessageId, {
            ...currentState,
          });
          await this.botCommandsStorage.delState(chatId, messageId);
        } else {
          await this.botCommandsStorage.delState(chatId, messageId);
        }
      }
    }
  }

  private async saveLatestStateOnChangeSuccessCommandHandlerIdAndClearLatestState(
    chatId: string,
    messageId: string,
    msg: BotCommandsProviderActionMsg
  ) {
    const currentState = await this.botCommandsStorage.getState(
      chatId,
      messageId
    );

    if (msg.handlerId !== currentState?.handlerId) {
      const usedMessageId = currentState?.usedMessageIds[0];
      if (usedMessageId && usedMessageId.length > 0) {
        await this.botCommandsStorage.patchState(chatId, usedMessageId, {
          ...currentState,
        });
        await this.botCommandsStorage.delState(chatId, messageId);
      }
    }
  }

  private async saveSuccessProcessOnContext<
    TMsg extends BotCommandsProviderActionMsg
  >(
    chatId: string,
    messageId: string,
    msg: BotCommandsProviderActionMsg,
    result: BotCommandsProviderActionResultType<TMsg>
  ) {
    await this.botCommandsStorage.patchState(chatId, messageId, {
      handlerId: msg.handlerId,
      request: { type: 'message', message: msg },
      response: result,
      context: result?.context || {},
    });
  }
}
