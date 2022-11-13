/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BotCommandsProviderActionMsg,
  BotCommandsService,
  BotCommandsToolsService,
} from '@kaufman-bot/core-server';
import {
  LanguageSwitcherStorage,
  LANGUAGE_SWITCHER_STORAGE,
} from '@kaufman-bot/language-switcher-server';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { Context } from 'grammy';
import { CustomInject } from 'nestjs-custom-injector';
import {
  BotInGroupsConfig,
  BOT_IN_GROUPS_CONFIG,
} from '../bot-in-groups-config/bot-in-groups.config';
import { BotInGroupsToolsService } from './bot-in-groups-tools.service';

@Injectable()
export class BotInGroupsProcessorService {
  private logger = new Logger(BotInGroupsProcessorService.name);

  @CustomInject(LANGUAGE_SWITCHER_STORAGE)
  private readonly languageSwitcherStorage!: LanguageSwitcherStorage;

  constructor(
    @Inject(BOT_IN_GROUPS_CONFIG)
    private readonly botInGroupsConfig: BotInGroupsConfig,
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly botCommandsService: BotCommandsService,
    private readonly botInGroupsToolsService: BotInGroupsToolsService
  ) {}

  async process(ctx: Context, defaultHandler?: () => Promise<unknown>) {
    if (!this.botCommandsToolsService.isGroupMessage(ctx.message)) {
      return await this.botCommandsService.process(ctx, defaultHandler);
    }

    let msg: BotCommandsProviderActionMsg = ctx.message!;
    if (!msg && ctx.callbackQuery) {
      msg = {
        message: ctx.message,
        callbackQueryData: ctx.callbackQuery.data,
        ...ctx.callbackQuery.message!,
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

    const dbLocale = await this.languageSwitcherStorage.getLanguageOfUser(
      this.botCommandsToolsService.getChatId(msg)
    );
    const detectedLocale = this.botCommandsToolsService.getLocale(msg, 'en');
    const locale = dbLocale || detectedLocale;

    const botName = this.botInGroupsConfig.botNames[locale][0];

    if (this.botCommandsToolsService.checkJoinNewMember(msg, ctx)) {
      await ctx.reply(
        this.botCommandsToolsService.getRandomItem(
          this.botInGroupsConfig.botMeetingInformation
            ? this.botInGroupsConfig.botMeetingInformation[locale]
            : [
                getText(`Hello! I'm ${botName} 😉`),
                getText('Hello!'),
                getText('Hello 🖖'),
              ]
        )
      );
      return;
    }

    const messageTextWithoutBotNames =
      this.botInGroupsToolsService.removePartialAllBotNamesFormMessage(
        msg.text,
        locale
      ) || '';

    const transformedMessageTextWithoutBotNames = this.botInGroupsConfig
      .transformMessageText
      ? this.botInGroupsConfig.transformMessageText(
          locale,
          messageTextWithoutBotNames
        )
      : messageTextWithoutBotNames;

    if (!msg.globalContext) {
      msg.globalContext = {};
    }
    if (
      this.botCommandsToolsService.isGroupMessage(msg) &&
      this.botInGroupsConfig.defaultGroupGlobalContext
    ) {
      Object.assign(
        msg.globalContext,
        this.botInGroupsConfig.defaultGroupGlobalContext
      );
    }

    if (
      this.botInGroupsToolsService.checkPartialContainBotNamesInMessage(
        msg.text,
        locale
      )
    ) {
      msg.text = `${botName} ${transformedMessageTextWithoutBotNames}`;

      ctx = new Context(
        {
          ...ctx.update,
          message: msg,
        },
        ctx.api,
        ctx.me
      );

      this.logger.debug(
        `Message from chat to bot: ${ctx.message?.chat?.id}, message: "${msg?.text}", callbackQueryData: "${msg?.callbackQueryData}"`
      );
      return await this.botCommandsService.process(ctx, defaultHandler);
    }
  }
}
