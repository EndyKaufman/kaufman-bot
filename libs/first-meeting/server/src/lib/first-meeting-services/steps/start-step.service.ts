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
  FirstMeetingConfig,
  FIRST_MEETING_CONFIG,
} from '../../first-meeting-config/first-meeting.config';
import {
  FirstMeeting,
  FirstMeetingStorage,
  FIRST_MEETING_STORAGE,
} from '../first-meeting.storage';

@Injectable()
export class StartStepService {
  @CustomInject(FIRST_MEETING_STORAGE)
  private readonly storage!: FirstMeetingStorage;

  @CustomInject(FIRST_MEETING_CONFIG)
  private readonly config!: FirstMeetingConfig;

  constructor(
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly translatesService: TranslatesService
  ) {}

  is({ msg }: { msg: BotCommandsProviderActionMsg }) {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    return this.botCommandsToolsService.checkCommands(
      msg.text,
      [getText('start')],
      locale
    );
  }

  async do<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({ msg }: { msg: TMsg }) {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    const text = this.translatesService.translate(
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
    await this.storage.pathState({
      telegramUserId: this.botCommandsToolsService.getChatId(msg),
      state: {
        status: 'AskFirstname',
        firstname: '',
        lastname: '',
        gender: 'Male',
      },
    });
    return text;
  }

  out<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({
    text,
    msg,
  }: {
    text: string;
    msg: TMsg;
  }):
    | BotCommandsProviderActionResultType<TMsg>
    | PromiseLike<BotCommandsProviderActionResultType<TMsg>> {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    return {
      type: 'text',
      text,
      message: msg,
      context: <Partial<FirstMeeting>>{ status: 'AskFirstname' },
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
            messagesMetadata: { AskFirstnameResponse: result },
          },
        }),
    };
  }
}
