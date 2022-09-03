import {
  BotCommandsCategory,
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
} from '@kaufman-bot/core-server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesModule } from 'nestjs-translates';
import {
  FirstMeetingConfig,
  FIRST_MEETING_CONFIG,
} from './first-meeting-config/first-meeting.config';
import { FirstMeetingService } from './first-meeting-services/first-meeting.service';
import {
  FirstMeetingStorage,
  FIRST_MEETING_STORAGE,
} from './first-meeting-services/first-meeting.storage';
import { AskFirstnameStepService } from './first-meeting-services/steps/ask-firstname-step.service';
import { AskGenderStepService } from './first-meeting-services/steps/ask-gender-step.service';
import { AskLastnameStateService } from './first-meeting-services/steps/ask-lastname-step.service';
import { CancelStepService } from './first-meeting-services/steps/cancel-step.service';
import { CommonService } from './first-meeting-services/steps/common.service';
import { EndStepService } from './first-meeting-services/steps/end-step.service';
import { HelpStepService } from './first-meeting-services/steps/help-step.service';
import { ResetStepService } from './first-meeting-services/steps/reset-step.service';
import { StartStepService } from './first-meeting-services/steps/start-step.service';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  providers: [
    { provide: FIRST_MEETING_STORAGE, useClass: FirstMeetingStorage },
    CommonService,
    AskFirstnameStepService,
    AskGenderStepService,
    AskLastnameStateService,
    CancelStepService,
    ResetStepService,
    StartStepService,
    EndStepService,
    HelpStepService,
  ],
  exports: [
    TranslatesModule,
    BotCommandsModule,
    FIRST_MEETING_STORAGE,
    CommonService,
    AskFirstnameStepService,
    AskGenderStepService,
    AskLastnameStateService,
    CancelStepService,
    ResetStepService,
    StartStepService,
    EndStepService,
    HelpStepService,
  ],
})
export class FirstMeetingModuleCore {}

@Module({
  imports: [FirstMeetingModuleCore],
  exports: [FirstMeetingModuleCore],
})
export class FirstMeetingModule {
  static forRoot(config: Pick<FirstMeetingConfig, 'botName'>): DynamicModule {
    return {
      module: FirstMeetingModule,
      providers: [
        {
          provide: FIRST_MEETING_CONFIG,
          useValue: <FirstMeetingConfig>{
            ...config,
            title: getText('First meeting'),
            name: 'meet',
            descriptions: getText(
              'Example of recursive contextable commands "first meeting"'
            ),
            usage: [
              getText('meet start'),
              getText('meet reset'),
              getText('meet help'),
            ],
            spyWords: [getText('meet')],
            category: BotCommandsCategory.system,
          },
        },
        {
          provide: BOT_COMMANDS_PROVIDER,
          useClass: FirstMeetingService,
        },
      ],
    };
  }
}
