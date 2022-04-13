import dialogflow, { protos } from '@google-cloud/dialogflow';
import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
  OnAfterBotCommands,
} from '@kaufman-bot/core/server';
import { DebugService } from '@kaufman-bot/debug-messages/server';
import { DEFAULT_LANGUAGE } from '@kaufman-bot/language-swither/server';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { v4 } from 'uuid';
import {
  DialogflowConfig,
  DIALOGFLOW_CONFIG,
} from '../dialogflow-config/dialogflow.config';
import { DialogflowStorage } from './dialogflow.storage';

export const DISABLE_DIALOGFLOW_COMMANDS = 'DISABLE_DIALOGFLOW_COMMANDS';

@Injectable()
export class DialogflowService
  implements BotCommandsProvider, OnAfterBotCommands
{
  private readonly logger = new Logger(DialogflowService.name);

  constructor(
    @Inject(DIALOGFLOW_CONFIG)
    private readonly dialogflowConfig: DialogflowConfig,
    private readonly dialogflowStorage: DialogflowStorage,
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly debugService: DebugService
  ) {}

  async onAfterBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    result: BotCommandsProviderActionResultType<TMsg>,
    msg: TMsg,
    ctx?,
    defaultHandler?: () => Promise<unknown>
  ): Promise<{ result: BotCommandsProviderActionResultType<TMsg>; msg: TMsg }> {
    if (msg?.botContext?.[DISABLE_DIALOGFLOW_COMMANDS]) {
      return { result, msg };
    }

    if (!defaultHandler && result === null) {
      msg.text = `dialog ${msg.text}`;
      const dialogResult = await this.onMessage<TMsg>(msg, ctx);
      if (dialogResult !== null) {
        return { result: dialogResult, msg };
      }
    }

    if (result !== null) {
      this.debugService.sendDebugInfo(
        msg,
        ctx,
        `call:resetUserSession`,
        this.dialogflowConfig.name
      );
      // reset last session if unhandled with dialog commands
      await this.dialogflowStorage.resetUserSession({
        telegramUserId: this.botCommandsToolsService.getChatId(msg),
        projectId: this.dialogflowConfig.projectId,
      });
    }

    return { result, msg };
  }

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg, ctx): Promise<BotCommandsProviderActionResultType<TMsg>> {
    return await this.onMessage(
      {
        ...msg,
        text: `${this.dialogflowConfig.name} ${BotCommandsEnum.help}`,
      },
      ctx
    );
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg, ctx): Promise<BotCommandsProviderActionResultType<TMsg>> {
    if (msg?.botContext?.[DISABLE_DIALOGFLOW_COMMANDS]) {
      return null;
    }

    const locale = this.botCommandsToolsService.getLocale(
      msg,
      DEFAULT_LANGUAGE
    );

    const spyWord = this.dialogflowConfig.spyWords.find((spyWord) =>
      this.botCommandsToolsService.checkCommands(msg.text, [spyWord], locale)
    );
    if (spyWord) {
      if (
        this.botCommandsToolsService.checkCommands(
          msg.text,
          [BotCommandsEnum.help],
          locale
        )
      ) {
        return {
          type: 'markdown',
          message: msg,
          markdown: this.botCommandsToolsService.generateHelpMessage(msg, {
            locale,
            name: this.dialogflowConfig.title,
            descriptions: this.dialogflowConfig.descriptions,
            usage: this.dialogflowConfig.usage,
            category: this.dialogflowConfig.category,
          }),
        };
      }

      const preparedText = this.botCommandsToolsService.clearCommands(
        msg.text,
        [spyWord],
        locale
      );

      const processedMsg = await this.process(msg, ctx, locale, preparedText);

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
  >(msg: TMsg, ctx, locale: string, text: string) {
    const ts = +new Date();
    const current = await this.dialogflowStorage.getUserSession({
      telegramUserId: this.botCommandsToolsService.getChatId(msg),
      projectId: this.dialogflowConfig.projectId,
    });
    const sessionId = current ? current.sessionId : v4();
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(
      this.dialogflowConfig.projectId,
      sessionId
    );

    const request: protos.google.cloud.dialogflow.v2.IDetectIntentRequest = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: locale,
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    this.debugService.sendDebugInfo(
      msg,
      ctx,
      'Detected intent',
      this.dialogflowConfig.name
    );
    const result = responses[0].queryResult;
    if (!result) {
      this.debugService.sendDebugInfo(
        msg,
        ctx,
        `Result not set`,
        this.dialogflowConfig.name
      );
      return null;
    }
    this.debugService.sendDebugInfo(
      msg,
      ctx,
      {
        Query: result.queryText,
        Response: result.fulfillmentText,
      },
      this.dialogflowConfig.name
    );
    if (result.intent) {
      if (current) {
        this.debugService.sendDebugInfo(
          msg,
          ctx,
          `call:appendToUserSession`,
          this.dialogflowConfig.name
        );
        await this.dialogflowStorage.appendToUserSession({
          telegramUserId: this.botCommandsToolsService.getChatId(msg),
          projectId: this.dialogflowConfig.projectId,
          sessionOfUsers: {
            sessionId,
            requestsMetadata: [{ ts, request }],
            responsesMetadata: [{ ts, response: responses[0] }],
          },
        });
      } else {
        this.debugService.sendDebugInfo(
          msg,
          ctx,
          `call:setUserSession`,
          this.dialogflowConfig.name
        );
        await this.dialogflowStorage.setUserSession({
          telegramUserId: this.botCommandsToolsService.getChatId(msg),
          projectId: this.dialogflowConfig.projectId,
          sessionOfUsers: {
            sessionId,
            requestsMetadata: [{ ts, request }],
            responsesMetadata: [{ ts, response: responses[0] }],
          },
        });
      }
      this.debugService.sendDebugInfo(
        msg,
        ctx,
        `Intent: ${result.intent.displayName}`,
        this.dialogflowConfig.name
      );
    } else {
      this.debugService.sendDebugInfo(
        msg,
        ctx,
        'No intent matched.',
        this.dialogflowConfig.name
      );
    }
    return result.fulfillmentText;
  }
}
