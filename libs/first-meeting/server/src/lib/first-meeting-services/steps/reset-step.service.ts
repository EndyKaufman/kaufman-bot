import {
  BotCommandsEnum,
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
import { CommonService } from './common.service';

@Injectable()
export class ResetStepService {
  @CustomInject(FIRST_MEETING_STORAGE)
  private readonly storage!: FirstMeetingStorage;

  constructor(
    private readonly commonService: CommonService,
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly translatesService: TranslatesService
  ) {}

  async is({ msg }: { msg: BotCommandsProviderActionMsg }) {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    return (
      this.commonService.checkSpyWords({ msg }) &&
      this.botCommandsToolsService.checkCommands(
        msg.text,
        [BotCommandsEnum.reset],
        locale
      )
    );
  }

  async do<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg) {
    await this.storage.delState({
      telegramUserId: this.botCommandsToolsService.getChatId(msg),
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
    return {
      type: 'text',
      text: this.translatesService.translate(
        this.botCommandsToolsService.getRandomItem([
          getText('Your meeting information has been deleted {{unamused}}'),
          getText('I forgot about your existence {{worried}}'),
        ]),
        locale,
        {
          unamused: '😒',
          worried: '😟',
        }
      ),
      message: msg,
    };
  }
}
