import {
  BotCommandsModule,
  BOT_COMMANDS_STORAGE,
} from '@kaufman-bot/core-server';
import { DEBUG_MESSAGES_STORAGE } from '@kaufman-bot/debug-messages-server';
import { DIALOGFLOW_STORAGE } from '@kaufman-bot/dialogflow-server';
import { FIRST_MEETING_STORAGE } from '@kaufman-bot/first-meeting-server';
import { LANGUAGE_SWITCHER_STORAGE } from '@kaufman-bot/language-switcher-server';
import { PrismaClientModule } from '@kaufman-bot/prisma-server';
import { DynamicModule, Module } from '@nestjs/common';
import { BotCommandsInDatabaseStorage } from './prisma-integrations-services/bot-commands-in-database.storage';
import { PrismaDebugMessagesStorage } from './prisma-integrations-services/prisma-debug-messages.storage';
import { PrismaDialogflowStorage } from './prisma-integrations-services/prisma-dialogflow.storage';
import { PrismaFirstMeetingStorage } from './prisma-integrations-services/prisma-first-meeting.storage';
import { PrismaLanguageSwitcherStorage } from './prisma-integrations-services/prisma-language-switcher.storage';

@Module({})
export class PrismaIntegrationsModule {
  static forRoot(): DynamicModule {
    return {
      module: PrismaIntegrationsModule,
      imports: [PrismaClientModule, BotCommandsModule],
      providers: [
        {
          provide: BOT_COMMANDS_STORAGE,
          useClass: BotCommandsInDatabaseStorage,
        },
        {
          provide: DEBUG_MESSAGES_STORAGE,
          useClass: PrismaDebugMessagesStorage,
        },
        {
          provide: LANGUAGE_SWITCHER_STORAGE,
          useClass: PrismaLanguageSwitcherStorage,
        },
        {
          provide: DIALOGFLOW_STORAGE,
          useClass: PrismaDialogflowStorage,
        },
        {
          provide: FIRST_MEETING_STORAGE,
          useClass: PrismaFirstMeetingStorage,
        },
      ],
      exports: [
        BOT_COMMANDS_STORAGE,
        DEBUG_MESSAGES_STORAGE,
        LANGUAGE_SWITCHER_STORAGE,
        DIALOGFLOW_STORAGE,
        FIRST_MEETING_STORAGE,
      ],
    };
  }
}
