import {
  BotCommandsProviderActionMsg,
  BotCommandsToolsService,
} from '@kaufman-bot/core-server';
import { Inject, Injectable } from '@nestjs/common';
import { TranslatesStorage } from 'nestjs-translates';
import {
  BotInGroupsConfig,
  BOT_IN_GROUPS_CONFIG,
} from '../bot-in-groups-config/bot-in-groups.config';

@Injectable()
export class BotInGroupsToolsService {
  constructor(
    @Inject(BOT_IN_GROUPS_CONFIG)
    private readonly botInGroupsConfig: BotInGroupsConfig,
    private readonly translatesStorage: TranslatesStorage,
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}

  removeAllBotNamesFormMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): string | undefined {
    return this.botCommandsToolsService.clearCommands(
      msg.text?.split(' ').join('').trim(),
      [
        ...this.botInGroupsConfig.botNames[msg.locale],
        ...this.botInGroupsConfig.botNames[
          this.translatesStorage.defaultLocale
        ],
      ],
      msg.locale
    );
  }

  removePartialAllBotNamesFormMessage(
    text: string | undefined,
    locale: string
  ): string | undefined {
    return this.botCommandsToolsService.clearCommands(
      text,
      [
        ...this.botInGroupsConfig.botNames[locale],
        ...this.botInGroupsConfig.botNames[
          this.translatesStorage.defaultLocale
        ],
      ],
      locale
    );
  }

  checkPartialContainBotNamesInMessage(
    text: string | undefined,
    locale: string
  ) {
    return this.botCommandsToolsService.checkCommands(text || '', [
      ...this.botInGroupsConfig.botNames[locale],
      ...this.botInGroupsConfig.botNames[this.translatesStorage.defaultLocale],
    ]);
  }
}
