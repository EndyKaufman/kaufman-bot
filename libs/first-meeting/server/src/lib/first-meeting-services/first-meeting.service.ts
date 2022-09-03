import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  OnContextBotCommands,
} from '@kaufman-bot/core-server';
import { Inject, Injectable } from '@nestjs/common';
import {
  FirstMeetingConfig,
  FIRST_MEETING_CONFIG,
} from '../first-meeting-config/first-meeting.config';
import { FirstMeeting } from './first-meeting.storage';
import { AskFirstnameStepService } from './steps/ask-firstname-step.service';
import { AskGenderStepService } from './steps/ask-gender-step.service';
import { AskLastnameStateService } from './steps/ask-lastname-step.service';
import { CancelStepService } from './steps/cancel-step.service';
import { CommonService } from './steps/common.service';
import { EndStepService } from './steps/end-step.service';
import { HelpStepService } from './steps/help-step.service';
import { ResetStepService } from './steps/reset-step.service';
import { StartStepService } from './steps/start-step.service';

@Injectable()
export class FirstMeetingService
  implements BotCommandsProvider, OnContextBotCommands
{
  constructor(
    @Inject(FIRST_MEETING_CONFIG)
    private readonly config: FirstMeetingConfig,
    private readonly commonService: CommonService,
    private readonly askFirstnameStepService: AskFirstnameStepService,
    private readonly askGenderStepService: AskGenderStepService,
    private readonly askLastnameStateService: AskLastnameStateService,
    private readonly cancelStepService: CancelStepService,
    private readonly resetStepService: ResetStepService,
    private readonly startStepService: StartStepService,
    private readonly endStepService: EndStepService,
    private readonly helpStepService: HelpStepService
  ) {}

  async onContextBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg, ctx): Promise<BotCommandsProviderActionResultType<TMsg>> {
    if (this.commonService.isDisable(msg)) {
      return null;
    }

    if (this.commonService.isContextProcess({ msg })) {
      if (this.cancelStepService.is({ msg })) {
        await this.cancelStepService.do<TMsg>(msg);
        return this.cancelStepService.out<TMsg>({ msg });
      }

      if (this.askFirstnameStepService.is({ msg })) {
        const { text, firstname } = await this.askFirstnameStepService.do<TMsg>(
          {
            msg,
            ctx,
          }
        );
        return this.askFirstnameStepService.out<TMsg>({
          text,
          msg,
          firstname,
        });
      }

      if (this.askLastnameStateService.is({ msg })) {
        const { text, lastname } = await this.askLastnameStateService.do<TMsg>({
          msg,
          ctx,
        });
        return this.askLastnameStateService.out<TMsg>({
          text,
          msg,
          lastname,
        });
      }

      if (this.askGenderStepService.is({ msg })) {
        const state: Partial<FirstMeeting> = await this.askGenderStepService.do(
          {
            msg,
            ctx,
          }
        );
        return this.askGenderStepService.out<TMsg>({
          state,
          msg,
        });
      }
    }

    return null;
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    if (this.commonService.isDisable(msg)) {
      return null;
    }

    const state = await this.commonService.getState<TMsg>(msg);

    if (this.commonService.checkSpyWords(msg)) {
      if (this.helpStepService.is({ msg })) {
        return this.helpStepService.out<TMsg>({ msg });
      }

      if (this.resetStepService.is({ msg })) {
        await this.resetStepService.processReset<TMsg>(msg);

        return this.resetStepService.out<TMsg>({ msg });
      }

      if (!state && this.startStepService.is({ msg })) {
        const text = await this.startStepService.do<TMsg>({ msg });
        return this.startStepService.out<TMsg>({ text, msg });
      }
    }

    if (state && this.endStepService.is({ state, msg })) {
      return this.endStepService.out<TMsg>({ state, msg });
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
