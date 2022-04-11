import {
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
  PrismaClientModule,
} from '@kaufman-bot/core/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesModule } from 'nestjs-translates';
import {
  FirstMeetingConfig,
  FIRST_MEETING_CONFIG,
} from './first-meeting-config/first-meeting.config';
import { FirstMeetingService } from './first-meeting-services/first-meeting.service';
import { FirstMeetingStorage } from './first-meeting-services/first-meeting.storage';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  exports: [TranslatesModule, BotCommandsModule],
})
export class FirstMeetingModule {
  static forRoot(config: Pick<FirstMeetingConfig, 'botName'>): DynamicModule {
    return {
      module: FirstMeetingModule,
      imports: [PrismaClientModule],
      providers: [
        FirstMeetingStorage,
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
          },
        },
        {
          provide: BOT_COMMANDS_PROVIDER,
          useClass: FirstMeetingService,
        },
      ],
      exports: [PrismaClientModule],
    };
  }
}
