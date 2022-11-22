import {
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
} from '@kaufman-bot/core-server';
import { Injectable } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInject } from 'nestjs-custom-injector';
import { TranslatesService } from 'nestjs-translates';
import {
  FirstMeetingStorage,
  FIRST_MEETING_STORAGE,
} from '../first-meeting.storage';
import { CommonService } from './common.service';

@Injectable()
export class HelloStepService {
  @CustomInject(FIRST_MEETING_STORAGE)
  private readonly storage!: FirstMeetingStorage;

  constructor(
    private readonly commonService: CommonService,
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly translatesService: TranslatesService
  ) {}

  async is<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({ msg }: { msg: TMsg }) {
    const state = await this.storage.getState(
      this.botCommandsToolsService.getChatId(msg)
    );
    return (
      state?.status === 'EndMeeting' &&
      this.botCommandsToolsService.checkCommands(
        msg.text,
        [getText('hi'), getText('hello'), getText('hey')],
        msg.locale
      )
    );
  }

  async out<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({
    msg,
  }: {
    msg: TMsg;
  }): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const state = await this.storage.getState(
      this.botCommandsToolsService.getChatId(msg)
    );
    if (!state) {
      throw new Error('state is not set');
    }
    return {
      type: 'markdown',
      markdown: this.translatesService
        .translate(
          this.botCommandsToolsService.getRandomItem([
            getText(
              `Hello {{meetGender}} {{firstname}} {{lastname}} {{vulcan}}`
            ),
            getText(`Hello {{firstname}} {{lastname}} {{handsplayed}}`),
            getText(`I'm glad to see you {{firstname}} {{wink}}`),
            getText(`Hi {{firstname}} {{vulcan}}`),
          ]),
          msg.locale,
          {
            vulcan: '🖖',
            handsplayed: '🖐',
            wink: '😉',
            ...state,
            meetGender: this.commonService.mapGenderToMeetGender(
              state,
              msg.locale
            ),
            firstname: this.botCommandsToolsService.capitalizeFirstLetter(
              state.firstname,
              msg.locale
            ),
            lastname: this.botCommandsToolsService.capitalizeFirstLetter(
              state.lastname,
              msg.locale
            ),
          }
        )
        .split('  ')
        .join(' ')
        .split('  ')
        .join(' '),
      message: msg,
      context: {},
    };
  }
}
