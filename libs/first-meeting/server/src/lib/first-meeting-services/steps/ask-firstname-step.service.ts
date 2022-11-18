import {
  BotCommandsEnum,
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
  FirstMeetingConfig,
  FIRST_MEETING_CONFIG,
} from '../../first-meeting-config/first-meeting.config';
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

  @CustomInject(FIRST_MEETING_CONFIG)
  private readonly config!: FirstMeetingConfig;

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
    const firstname =
      (msg.text &&
        !msg.callbackQueryData &&
        this.commonService.prepareText(msg.text, msg.locale)) ||
      'Unknown';

    if (state?.messagesMetadata?.AskFirstnameResponse) {
      await ctx.api.editMessageText(
        state.messagesMetadata.AskFirstnameResponse.chat.id,
        state.messagesMetadata.AskFirstnameResponse.message_id,
        state.messagesMetadata.AskFirstnameResponse
          ? `${
              state.messagesMetadata.AskFirstnameResponse.text
            } (${this.translatesService.translate(
              getText('Your answer'),
              msg.locale
            )}: ${firstname})`
          : state.messagesMetadata.AskFirstnameResponse
      );
    }
  }

  async is<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({ msg }: { msg: TMsg }) {
    const state = await this.storage.getState(
      this.botCommandsToolsService.getChatId(msg)
    );
    return (
      this.botCommandsToolsService.checkSpyWords({
        msg,
        spyWords: this.config.spyWords,
      }) &&
      !state &&
      this.botCommandsToolsService.checkCommands(
        msg.text,
        [BotCommandsEnum.start],
        msg.locale
      )
    );
  }

  async do<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({ msg }: { msg: TMsg }) {
    const text = this.getHelloText(msg.locale);
    await this.storage.pathState({
      userId: this.botCommandsToolsService.getChatId(msg),
      state: {
        status: 'AskFirstname',
        firstname: '',
        lastname: '',
        gender: 'Male',
      },
    });
    return text;
  }

  private getHelloText(locale: string) {
    return this.translatesService.translate(
      this.botCommandsToolsService.getRandomItem([
        getText(`Hey! I'm {{botName}} {{smile}}, what's your name?`),
        getText(`Hey! what's your name?`),
      ]),
      locale,
      {
        botName: this.config.botName[locale],
        smile: '🙂',
      }
    );
  }

  async out<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({
    msg,
  }: {
    msg: TMsg;
  }): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const text = this.getHelloText(msg.locale);
    return {
      type: 'text',
      text,
      message: msg,
      context: <Partial<FirstMeeting>>{ status: 'AskFirstname' },
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
            messagesMetadata: { AskFirstnameResponse: result },
          },
        }),
    };
  }
}
