import { Injectable, Logger } from '@nestjs/common';
import { CustomInject } from 'nestjs-custom-injector';
import {
  BotCommandsConfig,
  BOT_COMMANDS_CONFIG,
} from '../bot-commands-config/bot-commands.config';
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

const DEFAULT_MAX_RECURSIVE_DEPTH = 5;

@Injectable()
export class BotCommandsService implements BotCommandsProvider {
  private logger = new Logger(BotCommandsService.name);

  @CustomInject(BOT_COMMANDS_STORAGE)
  private botCommandsStorage!: BotCommandsStorageProvider;

  @CustomInject(BOT_COMMANDS_PROVIDER, {
    multi: true,
    providersFactory: (items) => {
      const len = items.length;
      for (let i = 0; i < len; i++) {
        if (!items[i].botCommandHandlerId) {
          items[i].botCommandHandlerId = `botCommandHandler#${i.toString()}`;
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

  async start(ctx) {
    const msg: BotCommandsProviderActionMsg = ctx.update.message;
    msg.botStart = true;
    await this.process(ctx);
  }

  async process(ctx, defaultHandler?: () => Promise<unknown>) {
    let msg: BotCommandsProviderActionMsg = ctx.update.message;
    if (!msg && ctx.update?.callback_query) {
      msg = ctx.update.callback_query;
    }
    if (!msg) {
      try {
        this.logger.debug(JSON.stringify(ctx));
      } catch (error) {
        this.logger.debug(ctx);
      }
      return;
    }

    const contextMessageId =
      this.botCommandsToolsService.getContextMessageId(msg);
    await this.botCommandsStorage.setLatestStateByChildMessageId(
      contextMessageId
    );

    let recursiveDepth = 1;
    while (
      recursiveDepth > 0 &&
      recursiveDepth <=
        (this.botCommandsConfig?.maxRecursiveDepth ||
          DEFAULT_MAX_RECURSIVE_DEPTH)
    ) {
      const result = await this.onMessage(msg, ctx, defaultHandler);

      if (result?.type === 'message') {
        msg = result.message;

        const contextMessageId =
          this.botCommandsToolsService.getContextMessageId(msg);
        await this.botCommandsStorage.setLatestStateByChildMessageId(
          contextMessageId
        );
      }

      const userId = this.botCommandsToolsService.getChatId(msg);

      const messageId = this.botCommandsToolsService.getMessageId(msg);
      const replyResultMessageId =
        this.botCommandsToolsService.getReplyMessageId(msg);

      if (result?.type === 'markdown') {
        const replyResult = await ctx.reply(result.markdown, {
          parse_mode: 'MarkdownV2',
          ...result.custom,
        });

        const state =
          (await this.botCommandsStorage.getState(userId, messageId)) ||
          undefined;

        if (result.callback) {
          const botCommandHandlerContext =
            state?.botCommandHandlerContext || {};
          await result.callback(replyResult, botCommandHandlerContext);
          if (state) {
            state.botCommandHandlerContext = botCommandHandlerContext;
          }
        }

        if (replyResultMessageId !== contextMessageId) {
          await this.botCommandsStorage.patchState(userId, messageId, {
            ...(state || {}),
            response: { type: 'message', message: replyResult },
          });
        }
      }

      if (result?.type === 'text') {
        const replyResult = await ctx.reply(result.text, {
          ...result.custom,
        });
        const state =
          (await this.botCommandsStorage.getState(userId, messageId)) ||
          undefined;

        if (result.callback) {
          const botCommandHandlerContext =
            state?.botCommandHandlerContext || {};
          await result.callback(replyResult, botCommandHandlerContext);
          if (state) {
            state.botCommandHandlerContext = botCommandHandlerContext;
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

  async onHelp<TMsg extends BotCommandsProviderActionMsg>(
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
          botCommandHandlerId: botCommandsProvider.botCommandHandlerId || null,
          botCommandHandlerContext: msg?.botCommandHandlerContext || {},
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

  async onMessage<TMsg extends BotCommandsProviderActionMsg>(
    msg: TMsg,
    ctx: BotCommandsProviderActionContext,
    defaultHandler?: () => Promise<unknown>
  ): Promise<BotCommandsProviderActionResultType<TMsg>> {
    let result: BotCommandsProviderActionResultType<TMsg> = null;

    msg = await this.processOnBeforeBotCommands(msg, ctx);

    const contextMessageId =
      this.botCommandsToolsService.getContextMessageId(msg);
    await this.botCommandsStorage.setLatestStateByChildMessageId(
      contextMessageId
    );

    if (!msg?.botCommandHandlerBreak) {
      result = await this.processOnMessage(result, msg, ctx);
    }

    if (!msg?.botCommandHandlerBreak) {
      result = await this.processOnContext(result, msg, ctx);
    }

    if (msg?.botCommandHandlerBreak) {
      return { type: 'stop', message: msg };
    }

    if (
      result === null &&
      this.botCommandsToolsService.checkCommands(
        msg.text,
        [BotCommandsEnum.help],
        msg.from.language_code
      )
    ) {
      return this.onHelp(msg, ctx);
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

  async processOnBeforeBotCommands<TMsg extends BotCommandsProviderActionMsg>(
    msg: TMsg,
    ctx?: BotCommandsProviderActionContext
  ): Promise<TMsg> {
    const len = this.botCommandsProviders.length;
    for (let i = 0; i < len; i++) {
      const botCommandsProvider = this.botCommandsProviders[i];
      if (
        botCommandsProvider.onBeforeBotCommands &&
        !msg?.botCommandHandlerBreak
      ) {
        msg = await botCommandsProvider.onBeforeBotCommands(
          {
            ...msg,
            botCommandHandlerId:
              botCommandsProvider.botCommandHandlerId || null,
            botCommandHandlerContext: msg?.botCommandHandlerContext || {},
          },
          ctx
        );
      }
    }
    return msg;
  }

  async processOnAfterBotCommands<TMsg extends BotCommandsProviderActionMsg>(
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
              botCommandHandlerId:
                botCommandsProvider.botCommandHandlerId || null,
              botCommandHandlerContext: msg?.botCommandHandlerContext || {},
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
    const chatId = this.botCommandsToolsService.getChatId(msg);
    const messageId = this.botCommandsToolsService.getMessageId(msg);

    const len = this.botCommandsProviders.length;
    for (let i = 0; i < len; i++) {
      const botCommandsProvider = this.botCommandsProviders[i];
      if (!result && !msg?.botCommandHandlerBreak) {
        (msg.botCommandHandlerId =
          botCommandsProvider.botCommandHandlerId || null),
          (msg.botCommandHandlerContext = msg?.botCommandHandlerContext || {}),
          (result = await botCommandsProvider.onMessage(msg, ctx));
        if (result) {
          msg.botCommandHandlerId =
            botCommandsProvider.botCommandHandlerId || null;
        }
      }
      if (msg?.botCommandHandlerClearState || msg?.botCommandHandlerBreak) {
        await this.botCommandsStorage.delState(chatId, messageId);
        msg.botCommandHandlerClearState = false;
        msg.botCommandHandlerBreak = false;
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
    const messageId = this.botCommandsToolsService.getMessageId(msg);

    const contextMessageId =
      this.botCommandsToolsService.getContextMessageId(msg);
    await this.botCommandsStorage.setLatestStateByChildMessageId(
      contextMessageId
    );

    let state = await this.botCommandsStorage.getState(chatId, messageId);

    if (state && result === null) {
      const len = this.botCommandsProviders.length;
      for (let i = 0; i < len; i++) {
        const botCommandsProvider = this.botCommandsProviders[i];
        state = await this.botCommandsStorage.getState(chatId, messageId);

        if (
          !result &&
          state?.botCommandHandlerId ===
            botCommandsProvider.botCommandHandlerId &&
          botCommandsProvider.onContextBotCommands &&
          !msg?.botCommandHandlerBreak
        ) {
          msg.botCommandHandlerContext = state?.botCommandHandlerContext || {};

          result = await botCommandsProvider.onContextBotCommands(
            {
              ...msg,
              botCommandHandlerId:
                botCommandsProvider.botCommandHandlerId || null,
              botCommandHandlerContext: msg?.botCommandHandlerContext || {},
            },
            ctx
          );
          if (result) {
            msg.botCommandHandlerId =
              botCommandsProvider.botCommandHandlerId || null;
          }
        }
      }
    }
    if (result && msg.botCommandHandlerId) {
      // if (contextMessageId !== messageId) {
      await this.botCommandsStorage.patchState(chatId, messageId, {
        botCommandHandlerId: msg.botCommandHandlerId,
        request: { type: 'message', message: msg },
        response: result,
        botCommandHandlerContext: result.context || {},
      });
      // }
    }

    if (msg?.botCommandHandlerClearState || msg?.botCommandHandlerBreak) {
      await this.botCommandsStorage.delState(chatId, messageId);
      msg.botCommandHandlerClearState = false;
      msg.botCommandHandlerBreak = false;
    }
    return result;
  }
}
