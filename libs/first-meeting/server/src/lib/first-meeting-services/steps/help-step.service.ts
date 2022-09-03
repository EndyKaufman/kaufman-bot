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

  is({ msg }: { msg: BotCommandsProviderActionMsg }) {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    return this.botCommandsToolsService.checkCommands(
      msg.text,
      [BotCommandsEnum.help],
      locale
    );
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
      type: 'markdown',
      message: msg,
      markdown: this.botCommandsToolsService.generateHelpMessage(msg, {
        locale,
        name: this.config.title,
        descriptions: this.config.descriptions,
        usage: this.config.usage,
        category: this.config.category,
      }),
    };
  }
}
