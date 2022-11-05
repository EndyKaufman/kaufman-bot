import {
  BotCommandsService,
  BotCommandsToolsService,
} from '@kaufman-bot/core-server';
import { DISABLE_DIALOGFLOW_COMMANDS } from '@kaufman-bot/dialogflow-server';
import { DISABLE_FIRST_MEETING_COMMANDS } from '@kaufman-bot/first-meeting-server';
import {
  LanguageSwitherStorage,
  LANGUAGE_SWITHER_STORAGE,
} from '@kaufman-bot/language-swither-server';
import {
  DISABLE_SHORT_COMMANDS__BEFORE_HOOK,
  ShortCommandsToolsService,
} from '@kaufman-bot/short-commands-server';
import { Inject, Injectable } from '@nestjs/common';
import { CustomInject } from 'nestjs-custom-injector';
import {
  BotInGroupsConfig,
  BOT_IN_GROUPS_CONFIG,
} from '../bot-in-groups-config/bot-in-groups.config';

@Injectable()
export class BotInGroupsProcessorService {
  @CustomInject(LANGUAGE_SWITHER_STORAGE)
  private readonly languageSwitherStorage!: LanguageSwitherStorage;

  constructor(
    @Inject(BOT_IN_GROUPS_CONFIG)
    private readonly botInGroupsConfig: BotInGroupsConfig,
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly botCommandsService: BotCommandsService,
    private readonly shortCommandsToolsService: ShortCommandsToolsService
  ) {}

  async process(ctx, defaultHandler?: () => Promise<unknown>) {
    const userId =
      ctx.update?.message?.chat?.id || ctx?.update?.message?.from?.id;

    const dbLocale = userId
      ? await this.languageSwitherStorage.getLanguageOfUser(userId)
      : null;

    const locale =
      dbLocale ||
      (ctx.update?.message?.chat?.id < 0
        ? 'en'
        : this.botCommandsToolsService.getLocale(ctx?.update?.message, 'en'));

    const botName = this.botInGroupsConfig.botNames[locale][0];

    if (ctx.update?.message?.from?.language_code) {
      ctx.update.message.from.language_code = locale;
    }

    if (ctx.update?.message?.chat?.id > 0) {
      await this.botCommandsService.process(ctx, defaultHandler);
      return;
    }

    if (ctx?.update?.message) {
      if (!ctx.update.message.globalContext) {
        ctx.update.message.globalContext = {};
      }
      ctx.update.message.globalContext[DISABLE_FIRST_MEETING_COMMANDS] = true;
      ctx.update.message.globalContext[DISABLE_SHORT_COMMANDS__BEFORE_HOOK] =
        true;
      if (ctx.update.message.text) {
        const shortCommand =
          this.shortCommandsToolsService.updateTextWithShortCommands(
            locale,
            this.botCommandsToolsService.clearCommands(
              ctx.update.message.text,
              [
                ...this.botInGroupsConfig.botNames[locale],
                ...this.botInGroupsConfig.botNames['en'],
              ],
              locale
            )
          );
        if (
          this.botCommandsToolsService.checkCommands(
            ctx.update.message.text,
            [
              ...this.botInGroupsConfig.botNames[locale],
              ...this.botInGroupsConfig.botNames['en'],
            ],
            locale
          )
        ) {
          ctx.update.message.text = `${botName} ${shortCommand}`;
        } else {
          ctx.update.message.text = shortCommand;
        }
      }
    }

    if (
      ctx.update?.message?.chat?.id < 0 &&
      ctx.update?.message?.new_chat_member?.id === ctx.botInfo.id
    ) {
      await ctx.reply(
        this.botCommandsToolsService.getRandomItem(
          this.botInGroupsConfig.botMeetingInformation[locale]
        )
      );
      return;
    }

    if (
      ctx.update?.message?.chat?.id < 0 &&
      ctx.update?.message?.reply_to_message?.from?.id === ctx.botInfo.id
    ) {
      ctx.update.message.text = `${botName} ${ctx.update.message.text}`;
      ctx.update.message.globalContext[DISABLE_DIALOGFLOW_COMMANDS] = true;
      await this.botCommandsService.process(ctx, defaultHandler);
      return;
    }

    await this.botCommandsService.process(ctx, defaultHandler);
  }
}
