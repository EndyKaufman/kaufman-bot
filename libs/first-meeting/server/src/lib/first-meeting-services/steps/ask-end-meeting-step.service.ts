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
  FirstMeeting,
  FirstMeetingStorage,
  FIRST_MEETING_STORAGE,
} from '../first-meeting.storage';
import { CommonService } from './common.service';

@Injectable()
export class EndMeetingStepContextService {
  @CustomInject(FIRST_MEETING_STORAGE)
  private readonly storage!: FirstMeetingStorage;

  constructor(
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly translatesService: TranslatesService,
    private readonly commonService: CommonService
  ) {}

  async is({
    msg,
    activateStatus,
  }: {
    msg: BotCommandsProviderActionMsg;
    activateStatus: string;
  }) {
    const context: Partial<FirstMeeting> = msg.context;
    return (
      this.commonService.isContextProcess({ msg }) &&
      context?.status === activateStatus
    );
  }

  async do({ msg }: { msg: BotCommandsProviderActionMsg }) {
    const context: Partial<FirstMeeting> = msg.context;
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    const state: Partial<FirstMeeting> = {
      ...context,
      status: 'EndMeeting',
      gender: this.botCommandsToolsService.checkCommands(
        this.commonService.prepareText(msg.data || msg.text, locale),
        [getText('female'), getText('fm'), getText('f')],
        locale
      )
        ? 'Female'
        : 'Male',
      messagesMetadata: { AskGenderRequest: msg },
    };
    await this.storage.pathState({
      userId: this.botCommandsToolsService.getChatId(msg),
      state,
    });
  }

  async out<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({
    msg,
  }: {
    msg: TMsg;
  }): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    const state = await this.storage.getState(
      this.botCommandsToolsService.getChatId(msg)
    );
    if (!state) {
      throw new Error('state is not set');
    }
    return {
      type: 'text',
      text: this.translatesService.translate(
        this.botCommandsToolsService.getRandomItem([
          getText(
            `Nice to meet you, {{meetGender}} {{firstname}} {{lastname}} {{vulcan}}`
          ),
          getText(`Nice to meet you, {{firstname}} {{vulcan}}`),
        ]),
        locale,
        {
          vulcan: '🖖',
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
      ),
      message: msg,
      context: <Partial<FirstMeeting>>{ status: 'EndMeeting' },
      callback: async (result) =>
        await this.storage.pathState({
          userId: this.botCommandsToolsService.getChatId(msg),
          state: {
            messagesMetadata: { EndMeetingResponse: result },
          },
        }),
    };
  }
}
