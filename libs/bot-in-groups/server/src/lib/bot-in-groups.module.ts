import {
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
} from '@kaufman-bot/core/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesModule } from 'nestjs-translates';
import {
  BotInGroupsConfig,
  BOT_IN_GROUPS_CONFIG,
} from './bot-in-groups-config/bot-in-groups.config';
import { BotInGroupsProcessorService } from './bot-in-groups-services/bot-in-groups-processor.service';
import { BotInGroupsService } from './bot-in-groups-services/bot-in-groups.service';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  exports: [TranslatesModule, BotCommandsModule],
})
export class BotInGroupsModule {
  static forRoot(
    config: Pick<
      BotInGroupsConfig,
      | 'botNames'
      | 'botMeetingInformation'
      | 'botDoNotHaveFullAccess'
      | 'botNowHaveFullAccess'
    >
  ): DynamicModule {
    return {
      module: BotInGroupsModule,
      providers: [
        {
          provide: BOT_IN_GROUPS_CONFIG,
          useValue: <BotInGroupsConfig>{
            ...config,
            title: getText('Bot in groups'),
            name: 'groups',
            descriptions: getText(
              'Commands for support work the bot in groups'
            ),
            usage: [getText('groups help'), getText('groups meet')],
            spyWords: [getText('groups')],
          },
        },
        {
          provide: BOT_COMMANDS_PROVIDER,
          useClass: BotInGroupsService,
        },
        BotInGroupsProcessorService,
      ],
      exports: [BotInGroupsProcessorService],
    };
  }
}
