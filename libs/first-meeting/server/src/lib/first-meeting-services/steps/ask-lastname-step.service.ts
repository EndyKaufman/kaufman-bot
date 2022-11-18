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
export class AskLastnameStepContextService {
  @CustomInject(FIRST_MEETING_STORAGE)
  private readonly storage!: FirstMeetingStorage;

  constructor(
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly translatesService: TranslatesService,
    private readonly commonService: CommonService
  ) {}

  async editMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({ msg, ctx }: { msg: TMsg; ctx: Context }) {
    const state = await this.storage.getState(
      this.botCommandsToolsService.getChatId(msg)
    );
    const lastname =
      (msg.text &&
        !msg.callbackQueryData &&
        this.commonService.prepareText(msg.text, msg.locale)) ||
      'Unknown';
    if (state?.messagesMetadata?.AskLastnameResponse) {
      await ctx.api.editMessageText(
        state.messagesMetadata.AskLastnameResponse.chat.id,
        state.messagesMetadata.AskLastnameResponse.message_id,
        state.messagesMetadata.AskLastnameResponse
          ? `${
              state.messagesMetadata.AskLastnameResponse.text
            } (${this.translatesService.translate(
              getText('Your answer'),
              msg.locale
            )}: ${lastname})`
          : state.messagesMetadata.AskLastnameResponse
      );
    }
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

  async do<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({ msg }: { msg: TMsg }) {
    await this.storage.pathState({
      userId: this.botCommandsToolsService.getChatId(msg),
      state: {
        messagesMetadata: { AskFirstnameRequest: msg },
      },
    });
  }

  async out<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({
    msg,
  }: {
    msg: TMsg;
  }): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const text = this.translatesService.translate(
      getText(`What is your last name?`),
      msg.locale
    );
    const firstname =
      (msg.text &&
        !msg.callbackQueryData &&
        this.commonService.prepareText(msg.text, msg.locale)) ||
      'Unknown';

    return {
      type: 'text',
      text,
      message: msg,
      context: <Partial<FirstMeeting>>{
        ...msg.context,
        status: 'AskLastname',
        firstname,
      },
      custom: {
        reply_markup: new InlineKeyboard()
          .text(
            '➡️' +
              this.translatesService.translate(getText('Next'), msg.locale),
            'next'
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
            messagesMetadata: { AskLastnameResponse: result },
          },
        }),
    };
  }
}
