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
  >({ msg, ctx }: { msg: TMsg; ctx }) {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    const state = await this.storage.getState(
      this.botCommandsToolsService.getChatId(msg)
    );
    const lastname =
      this.commonService.prepareText(msg.text, locale) || 'Unknown';
    if (state?.messagesMetadata?.AskLastnameResponse) {
      await ctx.telegram.editMessageText(
        state.messagesMetadata.AskLastnameResponse.chat.id,
        state.messagesMetadata.AskLastnameResponse.message_id,
        undefined,
        state.messagesMetadata.AskLastnameResponse
          ? `${
              state.messagesMetadata.AskLastnameResponse.text
            } (${this.translatesService.translate(
              getText('Your answer'),
              locale
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
    const botCommandHandlerContext: Partial<FirstMeeting> =
      msg.botCommandHandlerContext;
    return (
      this.commonService.isContextProcess({ msg }) &&
      botCommandHandlerContext?.status === activateStatus
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
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');

    const text = this.translatesService.translate(
      getText(`What is your last name?`),
      locale
    );
    const firstname =
      this.commonService.prepareText(msg.text, locale) || 'Unknown';

    return {
      type: 'text',
      text,
      message: msg,
      context: <Partial<FirstMeeting>>{
        ...msg.botCommandHandlerContext,
        status: 'AskLastname',
        firstname,
      },
      custom: {
        ...Markup.inlineKeyboard([
          Markup.button.callback(
            '➡️' + this.translatesService.translate(getText('Next'), locale),
            'next'
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
            messagesMetadata: { AskLastnameResponse: result },
          },
        }),
    };
  }
}
