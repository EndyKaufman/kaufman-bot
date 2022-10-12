import {
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
} from '@kaufman-bot/core-server';
import { Injectable } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInject } from 'nestjs-custom-injector';
import { TranslatesService } from 'nestjs-translates';
import { Markup } from 'telegraf';
import {
  FirstMeeting,
  FirstMeetingStorage,
  FIRST_MEETING_STORAGE,
} from '../first-meeting.storage';
import { CommonService } from './common.service';

@Injectable()
export class AskGenderStepContextService {
  @CustomInject(FIRST_MEETING_STORAGE)
  private readonly storage!: FirstMeetingStorage;

  constructor(
    private readonly commonService: CommonService,
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly translatesService: TranslatesService
  ) {}

  async editMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({ msg, ctx }: { msg: TMsg; ctx }) {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    const state = await this.storage.getState(
      this.botCommandsToolsService.getChatId(msg)
    );
    if (state?.messagesMetadata?.AskGenderResponse) {
      await ctx.telegram.editMessageText(
        state.messagesMetadata.AskGenderResponse.chat.id,
        state.messagesMetadata.AskGenderResponse.message_id,
        undefined,
        state.messagesMetadata.AskGenderResponse
          ? `${
              state.messagesMetadata.AskGenderResponse.text
            } (${this.translatesService.translate(
              getText('Your answer'),
              locale
            )}: ${this.translatesService.translate(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              state.gender!,
              locale
            )})`
          : state.messagesMetadata.AskGenderResponse
      );
    }
  }

  async do<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({ msg }: { msg: TMsg }) {
    await this.storage.pathState({
      userId: this.botCommandsToolsService.getChatId(msg),
      state: {
        messagesMetadata: { AskLastnameRequest: msg },
      },
    });
  }

  async is({
    msg,
    activateStatus,
  }: {
    msg: BotCommandsProviderActionMsg;
    activateStatus: string;
  }) {
    const botCommandHandlerContext: Partial<FirstMeeting> =
      msg.botCommandHandlerContext;
    return (
      this.commonService.isContextProcess({ msg }) &&
      botCommandHandlerContext?.status === activateStatus
    );
  }

  async out<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({
    msg,
  }: {
    msg: TMsg;
  }): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');

    const text = this.translatesService.translate(
      getText(`What is your gender?`),
      locale
    );
    const lastname = this.commonService.prepareText(msg.text, locale);

    return {
      type: 'text',
      text,
      message: msg,
      context: <Partial<FirstMeeting>>{
        ...msg.botCommandHandlerContext,
        status: 'AskGender',
        lastname,
      },
      custom: {
        ...Markup.inlineKeyboard([
          Markup.button.callback(
            '🚹' + this.translatesService.translate(getText('Male'), locale),
            'male'
          ),
          Markup.button.callback(
            '🚺' + this.translatesService.translate(getText('Female'), locale),
            'female'
          ),
          Markup.button.callback(
            '❌' + this.translatesService.translate(getText('Cancel'), locale),
            'exit'
          ),
        ]),
      },
      callback: async (result) =>
        await this.storage.pathState({
          userId: this.botCommandsToolsService.getChatId(msg),
          state: {
            messagesMetadata: { AskGenderResponse: result },
          },
        }),
    };
  }
}
