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
export class AskLastnameStateService {
  @CustomInject(FIRST_MEETING_STORAGE)
  private readonly storage!: FirstMeetingStorage;

  constructor(
    private readonly commonService: CommonService,
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly translatesService: TranslatesService
  ) {}

  async do<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({ msg, ctx }: { msg: TMsg; ctx }) {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    const text = this.translatesService.translate(
      getText(`What is your gender?`),
      locale
    );
    const currentState = await this.storage.pathState({
      telegramUserId: this.botCommandsToolsService.getChatId(msg),
      state: {
        messagesMetadata: { AskLastnameRequest: msg },
      },
    });
    const lastname = this.commonService.prepareText(msg.text, locale);
    if (currentState?.messagesMetadata?.AskLastnameResponse) {
      await ctx.telegram.editMessageText(
        currentState.messagesMetadata.AskLastnameResponse.chat.id,
        currentState.messagesMetadata.AskLastnameResponse.message_id,
        undefined,
        currentState.messagesMetadata.AskLastnameResponse
          ? `${
              currentState.messagesMetadata.AskLastnameResponse.text
            } (${this.translatesService.translate(
              getText('Your answer'),
              locale
            )}: ${lastname})`
          : currentState.messagesMetadata.AskLastnameResponse
      );
    }
    return { text, lastname };
  }

  is({ msg }: { msg: BotCommandsProviderActionMsg }) {
    const botCommandHandlerContext: Partial<FirstMeeting> =
      msg.botCommandHandlerContext;
    return botCommandHandlerContext?.status === 'AskLastname';
  }

  out<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({
    text,
    msg,
    lastname,
  }: {
    text: string;
    msg: TMsg;
    lastname: string;
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
          telegramUserId: this.botCommandsToolsService.getChatId(msg),
          state: {
            messagesMetadata: { AskGenderResponse: result },
          },
        }),
    };
  }
}
