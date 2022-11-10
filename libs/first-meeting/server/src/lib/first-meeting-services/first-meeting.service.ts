import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  OnContextBotCommands,
} from '@kaufman-bot/core-server';
import { Inject, Injectable } from '@nestjs/common';
import { Context } from 'grammy';
import {
  FirstMeetingConfig,
  FIRST_MEETING_CONFIG,
} from '../first-meeting-config/first-meeting.config';
import { EndMeetingStepContextService } from './steps/ask-end-meeting-step.service';
import { AskFirstnameStepService } from './steps/ask-firstname-step.service';
import { AskGenderStepContextService } from './steps/ask-gender-step.service';
import { AskLastnameStepContextService } from './steps/ask-lastname-step.service';
import { CancelStepContextService } from './steps/cancel-step.service';
import { CommonService } from './steps/common.service';
import { HelloStepService } from './steps/hello-step.service';
import { HelpStepService } from './steps/help-step.service';
import { ResetStepService } from './steps/reset-step.service';

@Injectable()
export class FirstMeetingService
  implements BotCommandsProvider, OnContextBotCommands
{
  handlerId = FirstMeetingService.name;

  constructor(
    @Inject(FIRST_MEETING_CONFIG)
    private readonly config: FirstMeetingConfig,
    private readonly commonService: CommonService,
    private readonly askLastnameStepContextService: AskLastnameStepContextService,
    private readonly endMeetingStepContextService: EndMeetingStepContextService,
    private readonly askGenderStepContextService: AskGenderStepContextService,
    private readonly cancelStepContextService: CancelStepContextService,
    private readonly resetStepService: ResetStepService,
    private readonly askFirstnameStepService: AskFirstnameStepService,
    private readonly helloStepService: HelloStepService,
    private readonly helpStepService: HelpStepService
  ) {}

  async onContextBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    msg: TMsg,
    ctx: Context
  ): Promise<BotCommandsProviderActionResultType<TMsg>> {
    if (await this.commonService.isDisable({ msg })) {
      return null;
    }

    if (await this.cancelStepContextService.is({ msg })) {
      await this.cancelStepContextService.do<TMsg>(msg);
      return await this.cancelStepContextService.out<TMsg>({ msg });
    }

    if (
      await this.askLastnameStepContextService.is({
        msg,
        activateStatus: 'AskFirstname',
      })
    ) {
      await this.askLastnameStepContextService.do<TMsg>({
        msg,
      });
      await this.askFirstnameStepService.editMessage({ msg, ctx });
      return await this.askLastnameStepContextService.out<TMsg>({
        msg,
      });
    }

    if (
      await this.askGenderStepContextService.is({
        msg,
        activateStatus: 'AskLastname',
      })
    ) {
      await this.askGenderStepContextService.do<TMsg>({
        msg,
      });
      await this.askLastnameStepContextService.editMessage({ msg, ctx });
      return await this.askGenderStepContextService.out<TMsg>({
        msg,
      });
    }

    if (
      await this.endMeetingStepContextService.is({
        msg,
        activateStatus: 'AskGender',
      })
    ) {
      await this.endMeetingStepContextService.do({
        msg,
      });
      await this.askGenderStepContextService.editMessage({ msg, ctx });
      return await this.endMeetingStepContextService.out<TMsg>({
        msg,
      });
    }

    return null;
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    if (await this.commonService.isDisable({ msg })) {
      return null;
    }

    if (await this.helpStepService.is({ msg })) {
      return await this.helpStepService.out<TMsg>({ msg });
    }

    if (await this.resetStepService.is({ msg })) {
      await this.resetStepService.do<TMsg>(msg);
      return await this.resetStepService.out<TMsg>({ msg });
    }

    if (await this.askFirstnameStepService.is({ msg })) {
      await this.askFirstnameStepService.do<TMsg>({ msg });
      return await this.askFirstnameStepService.out<TMsg>({ msg });
    }

    if (await this.helloStepService.is({ msg })) {
      return await this.helloStepService.out<TMsg>({ msg });
    }

    return null;
  }

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    return await this.onMessage({
      ...msg,
      text: `${this.config.name} ${BotCommandsEnum.help}`,
    });
  }
}
