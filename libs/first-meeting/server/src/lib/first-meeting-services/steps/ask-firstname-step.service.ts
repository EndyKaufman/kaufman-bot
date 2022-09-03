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
export class AskFirstnameStepService {
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
    return botCommandHandlerContext?.status === 'AskFirstname';
  }

  async do<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({ msg, ctx }: { msg: TMsg; ctx }) {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    const text = this.translatesService.translate(
      getText(`What is your last name?`),
      locale
    );
    const currentState = await this.storage.pathState({
      telegramUserId: this.botCommandsToolsService.getChatId(msg),
      state: {
        messagesMetadata: { AskFirstnameRequest: msg },
      },
    });
    const firstname =
      this.commonService.prepareText(msg.text, locale) || 'Unknown';

    if (currentState?.messagesMetadata?.AskFirstnameResponse) {
      await ctx.telegram.editMessageText(
        currentState.messagesMetadata.AskFirstnameResponse.chat.id,
        currentState.messagesMetadata.AskFirstnameResponse.message_id,
        undefined,
        currentState.messagesMetadata.AskFirstnameResponse
          ? `${
              currentState.messagesMetadata.AskFirstnameResponse.text
            } (${this.translatesService.translate(
              getText('Your answer'),
              locale
            )}: ${firstname})`
          : currentState.messagesMetadata.AskFirstnameResponse
      );
    }
    return { text, firstname };
  }

  out<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({
    text,
    msg,
    firstname,
  }: {
    text: string;
    msg: TMsg;
    firstname: string;
  }):
    | BotCommandsProviderActionResultType<TMsg>
    | PromiseLike<BotCommandsProviderActionResultType<TMsg>> {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
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
          telegramUserId: this.botCommandsToolsService.getChatId(msg),
          state: {
            messagesMetadata: { AskLastnameResponse: result },
          },
        }),
    };
  }
}
