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
export class AskGenderStepService {
  @CustomInject(FIRST_MEETING_STORAGE)
  private readonly storage!: FirstMeetingStorage;

  constructor(
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly translatesService: TranslatesService,
    private readonly commonService: CommonService
  ) {}

  is({ msg }: { msg: BotCommandsProviderActionMsg }) {
    const botCommandHandlerContext: Partial<FirstMeeting> =
      msg.botCommandHandlerContext;
    return botCommandHandlerContext?.status === 'AskGender';
  }

  async do({ msg, ctx }: { msg: BotCommandsProviderActionMsg; ctx }) {
    const context: Partial<FirstMeeting> = msg.botCommandHandlerContext;
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
    const currentState = await this.storage.pathState({
      telegramUserId: this.botCommandsToolsService.getChatId(msg),
      state,
    });
    if (currentState?.messagesMetadata?.AskGenderResponse) {
      await ctx.telegram.editMessageText(
        currentState.messagesMetadata.AskGenderResponse.chat.id,
        currentState.messagesMetadata.AskGenderResponse.message_id,
        undefined,
        currentState.messagesMetadata.AskGenderResponse
          ? `${
              currentState.messagesMetadata.AskGenderResponse.text
            } (${this.translatesService.translate(
              getText('Your answer'),
              locale
            )}: ${this.translatesService.translate(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              state.gender!,
              locale
            )})`
          : currentState.messagesMetadata.AskGenderResponse
      );
    }
    return state;
  }

  out<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({
    state,
    msg,
  }: {
    state: Partial<FirstMeeting>;
    msg: TMsg;
  }):
    | BotCommandsProviderActionResultType<TMsg>
    | PromiseLike<BotCommandsProviderActionResultType<TMsg>> {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
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
          telegramUserId: this.botCommandsToolsService.getChatId(msg),
          state: {
            messagesMetadata: { EndMeetingResponse: result },
          },
        }),
    };
  }
}
