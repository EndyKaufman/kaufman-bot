import {
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
} from '@kaufman-bot/core-server';
import { Injectable } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesService } from 'nestjs-translates';
import { FirstMeeting } from '../first-meeting.storage';
import { CommonService } from './common.service';

@Injectable()
export class EndStepService {
  constructor(
    private readonly commonService: CommonService,
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly translatesService: TranslatesService
  ) {}

  is({
    state,
    msg,
  }: {
    state: FirstMeeting | null;
    msg: BotCommandsProviderActionMsg;
  }) {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    return (
      state?.status === 'EndMeeting' &&
      this.botCommandsToolsService.checkCommands(
        msg.text,
        [getText('hi'), getText('hello'), getText('hey')],
        locale
      )
    );
  }

  out<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({
    state,
    msg,
  }: {
    state: FirstMeeting;
    msg: TMsg;
  }):
    | BotCommandsProviderActionResultType<TMsg>
    | PromiseLike<BotCommandsProviderActionResultType<TMsg>> {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
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
          locale,
          {
            vulcan: '🖖',
            handsplayed: '🖐',
            wink: '😉',
            ...state,
            meetGender: this.commonService.mapGenderToMeetGender(state, locale),
            firstname: this.botCommandsToolsService.capitalizeFirstLetter(
              state.firstname,
              locale
            ),
            lastname: this.botCommandsToolsService.capitalizeFirstLetter(
              state.lastname,
              locale
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
