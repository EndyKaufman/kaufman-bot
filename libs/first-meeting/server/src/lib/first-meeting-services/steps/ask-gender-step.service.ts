/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
} from '@kaufman-bot/core-server';
import { Injectable } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { Context, InlineKeyboard } from 'grammy';
import { CustomInject } from 'nestjs-custom-injector';
import { TranslatesService } from 'nestjs-translates';
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
  >({ msg, ctx }: { msg: TMsg; ctx: Context }) {
    const state = await this.storage.getState(
      this.botCommandsToolsService.getChatId(msg)
    );
    if (state?.messagesMetadata?.AskGenderResponse) {
      await ctx.api.editMessageText(
        state.messagesMetadata.AskGenderResponse.chat.id,
        state.messagesMetadata.AskGenderResponse.message_id,
        state.messagesMetadata.AskGenderResponse
          ? `${
              state.messagesMetadata.AskGenderResponse.text
            } (${this.translatesService.translate(
              getText('Your answer'),
              msg.locale
            )}: ${this.translatesService.translate(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              state.gender!,
              msg.locale
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
    const context: Partial<FirstMeeting> = msg.context!;
    return (
      this.commonService.isContextProcess({ msg }) &&
      context?.status === activateStatus
    );
  }

  async out<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({
    msg,
  }: {
    msg: TMsg;
  }): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const text = this.translatesService.translate(
      getText(`What is your gender?`),
      msg.locale
    );
    const lastname = this.commonService.prepareText(msg.text || '', msg.locale);

    return {
      type: 'text',
      text,
      message: msg,
      context: <Partial<FirstMeeting>>{
        ...msg.context,
        status: 'AskGender',
        lastname,
      },
      custom: {
        reply_markup: new InlineKeyboard()
          .text(
            '🚹' +
              this.translatesService.translate(getText('Male'), msg.locale),
            'male'
          )
          .text(
            '🚺' +
              this.translatesService.translate(getText('Female'), msg.locale),
            'female'
          )
          .text(
            '❌' +
              this.translatesService.translate(getText('Cancel'), msg.locale),
            'exit'
          ),
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
