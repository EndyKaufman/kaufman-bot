import {
  BotCommandsProviderActionMsg,
  BotCommandsToolsService,
} from '@kaufman-bot/core-server';
import { Injectable } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInject } from 'nestjs-custom-injector';
import { TranslatesService } from 'nestjs-translates';
import {
  FirstMeetingConfig,
  FIRST_MEETING_CONFIG,
} from '../../first-meeting-config/first-meeting.config';
import {
  FirstMeeting,
  FirstMeetingStorage,
  FIRST_MEETING_STORAGE,
} from '../first-meeting.storage';

export const DISABLE_FIRST_MEETING_COMMANDS = 'DISABLE_FIRST_MEETING_COMMANDS';

@Injectable()
export class CommonService {
  @CustomInject(FIRST_MEETING_STORAGE)
  private readonly storage!: FirstMeetingStorage;

  @CustomInject(FIRST_MEETING_CONFIG)
  private readonly config!: FirstMeetingConfig;

  constructor(
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly translatesService: TranslatesService
  ) {}

  mapGenderToMeetGender(firstMeeting: Partial<FirstMeeting>, locale: string) {
    return this.translatesService.translate(
      firstMeeting.gender === 'Female' ? getText('Madam') : getText('Sir'),
      locale
    );
  }

  prepareText(text: string, locale: string) {
    if (
      this.botCommandsToolsService.checkCommands(
        text,
        [getText('skip'), getText('next')],
        locale
      )
    ) {
      return '';
    }
    return this.botCommandsToolsService
      .clearCommands(
        text,
        [
          getText('I'),
          getText('hi'),
          getText('hello'),
          getText('hey'),
          getText('am'),
          getText('my'),
          getText('is'),
          getText('name'),
          getText('lastname'),
          getText('firstname'),
          getText('last'),
          getText('first'),
        ],
        locale
      )
      .trim();
  }

  isContextProcess({ msg }: { msg: BotCommandsProviderActionMsg }) {
    const botCommandHandlerContext: Partial<FirstMeeting> =
      msg.botCommandHandlerContext;
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    return (
      this.botCommandsToolsService.checkCommands(
        msg.text,
        [this.config.name],
        locale
      ) || Object.keys(botCommandHandlerContext).length > 0
    );
  }

  isDisable(msg: BotCommandsProviderActionMsg) {
    return msg?.botGlobalContext?.[DISABLE_FIRST_MEETING_COMMANDS];
  }

  async getState<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg) {
    return await this.storage.getState({
      telegramUserId: this.botCommandsToolsService.getChatId(msg),
    });
  }

  checkSpyWords(msg: BotCommandsProviderActionMsg) {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    return this.config.spyWords.find((spyWord) =>
      this.botCommandsToolsService.checkCommands(msg.text, [spyWord], locale)
    );
  }
}
