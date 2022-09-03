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
  FirstMeetingStorage,
  FIRST_MEETING_STORAGE,
} from '../first-meeting.storage';

@Injectable()
export class CancelStepService {
  @CustomInject(FIRST_MEETING_STORAGE)
  private readonly storage!: FirstMeetingStorage;

  constructor(
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly translatesService: TranslatesService
  ) {}

  is({ msg }: { msg: BotCommandsProviderActionMsg }) {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    return this.botCommandsToolsService.checkCommands(
      msg.text || msg.data,
      [
        getText('exit'),
        getText('reset'),
        getText('cancel'),
        getText('stop'),
        getText('end'),
      ],
      locale
    );
  }

  async do<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg) {
    await this.storage.pathState({
      telegramUserId: this.botCommandsToolsService.getChatId(msg),
      state: {
        ...msg.botCommandHandlerContext,
        status: 'EndMeeting',
        messagesMetadata: { EndMeetingRequest: msg },
      },
    });
  }

  out<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({
    msg,
  }: {
    msg: TMsg;
  }):
    | BotCommandsProviderActionResultType<TMsg>
    | PromiseLike<BotCommandsProviderActionResultType<TMsg>> {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    return {
      type: 'text',
      text: this.translatesService.translate(
        getText(`{{close}} Meeting canceled`),
        locale,
        { close: '❌' }
      ),
      message: msg,
      context: { status: 'EndMeeting' },
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
