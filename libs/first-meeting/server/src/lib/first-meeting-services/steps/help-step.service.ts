import {
  BotCommandsEnum,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
} from '@kaufman-bot/core-server';
import { Injectable } from '@nestjs/common';
import { CustomInject } from 'nestjs-custom-injector';
import {
  FirstMeetingConfig,
  FIRST_MEETING_CONFIG,
} from '../../first-meeting-config/first-meeting.config';

@Injectable()
export class HelpStepService {
  @CustomInject(FIRST_MEETING_CONFIG)
  private readonly config!: FirstMeetingConfig;

  constructor(
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}

  async is({ msg }: { msg: BotCommandsProviderActionMsg }) {
    return (
      this.botCommandsToolsService.checkSpyWords({
        msg,
        spyWords: this.config.spyWords,
      }) &&
      this.botCommandsToolsService.checkCommands(
        msg.text,
        [BotCommandsEnum.help],
        msg.locale
      )
    );
  }

  async out<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >({
    msg,
  }: {
    msg: TMsg;
  }): Promise<BotCommandsProviderActionResultType<TMsg>> {
    return {
      type: 'markdown',
      message: msg,
      markdown: this.botCommandsToolsService.generateHelpMessage(msg, {
        locale: msg.locale,
        name: this.config.title,
        descriptions: this.config.descriptions,
        usage: this.config.usage,
        category: this.config.category,
      }),
    };
  }
}
