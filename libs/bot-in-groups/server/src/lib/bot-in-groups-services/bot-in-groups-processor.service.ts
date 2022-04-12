import {
  BotCommandsService,
  BotCommandsToolsService,
} from '@kaufman-bot/core/server';
import { DISABLE_FIRST_MEETING_COMMANDS } from '@kaufman-bot/first-meeting/server';
import {
  DEFAULT_LANGUAGE,
  LanguageSwitherStorage,
} from '@kaufman-bot/language-swither/server';
import {
  DISABLE_SHORT_COMMANDS__BEFORE_HOOK,
  ShortCommandsToolsService,
} from '@kaufman-bot/short-commands/server';
import { Inject, Injectable } from '@nestjs/common';
import {
  BotInGroupsConfig,
  BOT_IN_GROUPS_CONFIG,
} from '../bot-in-groups-config/bot-in-groups.config';

@Injectable()
export class BotInGroupsProcessorService {
  constructor(
    @Inject(BOT_IN_GROUPS_CONFIG)
    private readonly botCommandsConfig: BotInGroupsConfig,
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly botCommandsService: BotCommandsService,
    private readonly languageSwitherStorage: LanguageSwitherStorage,
    private readonly shortCommandsToolsService: ShortCommandsToolsService
  ) {}

  async process(ctx, defaultHandler?: () => Promise<unknown>) {
    const telegramUserId =
      ctx.update?.message?.chat?.id || ctx?.update?.message?.from?.id;

    const dbLocale = telegramUserId
      ? await this.languageSwitherStorage.getLanguageOfUser(telegramUserId)
      : null;

    const locale =
      dbLocale ||
      (ctx.update?.message?.chat?.id < 0
        ? DEFAULT_LANGUAGE
        : this.botCommandsToolsService.getLocale(
            ctx?.update?.message,
            DEFAULT_LANGUAGE
          ));

    const botName = this.botCommandsConfig.botNames[locale][0];

    if (ctx.update?.message?.from?.language_code) {
      ctx.update.message.from.language_code = locale;
    }

    if (ctx.update?.message?.chat?.id > 0) {
      await this.botCommandsService.process(ctx, defaultHandler);
      return;
    }

    if (ctx?.update?.message) {
      if (!ctx.update.message.botContext) {
        ctx.update.message.botContext = {};
      }
      ctx.update.message.botContext[DISABLE_FIRST_MEETING_COMMANDS] = true;
      ctx.update.message.botContext[DISABLE_SHORT_COMMANDS__BEFORE_HOOK] = true;
      if (ctx.update.message.text) {
        const shortCommand =
          this.shortCommandsToolsService.updateTextWithShortCommands(
            locale,
            this.botCommandsToolsService.clearCommands(
              ctx.update.message.text,
              this.botCommandsConfig.botNames[locale],
              locale
            )
          );
        if (
          this.botCommandsToolsService.checkCommands(
            ctx.update.message.text,
            this.botCommandsConfig.botNames[locale],
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
          this.botCommandsConfig.botMeetingInformation[locale]
        )
      );
      return;
    }

    if (
      ctx.update?.message?.chat?.id < 0 &&
      ctx.update?.message?.reply_to_message?.from?.id === ctx.botInfo.id
    ) {
      ctx.update.message.text = `${botName} ${ctx.update.message.text}`;
      await this.botCommandsService.process(ctx, defaultHandler);
      return;
    }

    await this.botCommandsService.process(ctx, defaultHandler);
  }
}
