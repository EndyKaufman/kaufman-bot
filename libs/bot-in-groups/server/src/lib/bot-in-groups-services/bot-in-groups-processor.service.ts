import {
  BotCommandsService,
  BotCommandsToolsService,
} from '@kaufman-bot/core/server';
import {
  DEFAULT_LANGUAGE,
  LanguageSwitherStorage,
} from '@kaufman-bot/language-swither/server';
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
    private readonly languageSwitherStorage: LanguageSwitherStorage
  ) {}

  async process(ctx, defaultHandler?: () => Promise<unknown>) {
    const dbLocale = ctx?.update?.message?.from?.id
      ? await this.languageSwitherStorage.getLanguageOfUser(
          ctx?.update?.message.from.id
        )
      : null;
    const locale =
      dbLocale ||
      this.botCommandsToolsService.getLocale(
        ctx?.update?.message,
        DEFAULT_LANGUAGE
      );

    if (ctx.update?.message?.chat?.id > 0) {
      await this.botCommandsService.process(ctx, defaultHandler);
      return;
    }
    const admins = await ctx.getChatAdministrators();
    const botIsAdmin =
      admins.filter((admin) => admin.user.id === ctx.botInfo.id).length > 0;

    if (
      ctx.update?.message?.chat?.id < 0 &&
      ctx.update?.message?.new_chat_member?.id === ctx.botInfo.id
    ) {
      await ctx.reply(
        this.botCommandsToolsService.getRandomItem(
          this.botCommandsConfig.botMeetingInformation[locale]
        )
      );
      if (!botIsAdmin) {
        await ctx.reply(
          this.botCommandsToolsService.getRandomItem(
            this.botCommandsConfig.botDoNotHaveFullAccess[locale]
          )
        );
      }
      return;
    }

    if (
      ctx.update.my_chat_member?.chat?.id < 0 &&
      ctx.update.my_chat_member?.old_chat_member.user.id === ctx.botInfo.id &&
      ctx.update.my_chat_member?.old_chat_member.status === 'left' &&
      ctx.update.my_chat_member?.new_chat_member.user.id === ctx.botInfo.id &&
      ctx.update.my_chat_member?.new_chat_member.status === 'administrator'
    ) {
      await ctx.reply(
        this.botCommandsToolsService.getRandomItem(
          this.botCommandsConfig.botNowHaveFullAccess[locale]
        )
      );
      return;
    }

    if (
      ctx.update.my_chat_member?.chat?.id < 0 &&
      ctx.update.my_chat_member?.old_chat_member.user.id === ctx.botInfo.id &&
      ctx.update.my_chat_member?.old_chat_member.status === 'member' &&
      ctx.update.my_chat_member?.new_chat_member.user.id === ctx.botInfo.id &&
      ctx.update.my_chat_member?.new_chat_member.status === 'administrator'
    ) {
      await ctx.reply(
        this.botCommandsToolsService.getRandomItem(
          this.botCommandsConfig.botNowHaveFullAccess[locale]
        )
      );
      return;
    }

    if (
      ctx.update?.message?.chat?.id < 0 &&
      ctx.update?.message?.reply_to_message?.from?.id === ctx.botInfo.id
    ) {
      ctx.update.message.text = `${this.botCommandsConfig.botNames[0]} ${ctx.update.message.text}`;
      await this.botCommandsService.process(ctx, defaultHandler);
      return;
    }

    if (botIsAdmin) {
      await this.botCommandsService.process(ctx, defaultHandler);
    }
  }
}
