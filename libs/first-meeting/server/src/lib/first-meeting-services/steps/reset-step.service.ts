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
  FirstMeetingConfig,
  FIRST_MEETING_CONFIG,
} from '../../first-meeting-config/first-meeting.config';
import {
  FirstMeetingStorage,
  FIRST_MEETING_STORAGE,
} from '../first-meeting.storage';

@Injectable()
export class ResetStepService {
  @CustomInject(FIRST_MEETING_STORAGE)
  private readonly storage!: FirstMeetingStorage;

  @CustomInject(FIRST_MEETING_CONFIG)
  private readonly config!: FirstMeetingConfig;

  constructor(
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly translatesService: TranslatesService
  ) {}

  async is({ msg }: { msg: BotCommandsProviderActionMsg }) {
    return (
      this.botCommandsToolsService.checkSpyWords({
        msg,
        spyWords: this.config.spyWords,
      }) &&
      this.botCommandsToolsService.checkCommands(
        msg.text,
        [BotCommandsEnum.reset],
        msg.locale
      )
    );
  }

  async do<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg) {
    await this.storage.delState(this.botCommandsToolsService.getChatId(msg));
  }

  async out<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({
    msg,
  }: {
    msg: TMsg;
  }): Promise<BotCommandsProviderActionResultType<TMsg>> {
    return {
      type: 'text',
      text: this.translatesService.translate(
        this.botCommandsToolsService.getRandomItem([
          getText('Your meeting information has been deleted {{unamused}}'),
          getText('I forgot about your existence {{worried}}'),
        ]),
        msg.locale,
        {
          unamused: '😒',
          worried: '😟',
        }
      ),
      message: msg,
    };
  }
}
