import {
  BotCommandsCategory,
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
} from '@kaufman-bot/core-server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { TranslatesModule } from 'nestjs-translates';
import {
  DebugMessagesConfig,
  DEBUG_MESSAGES_CONFIG,
} from './debug-messages-config/debug-messages.config';
import { DebugMessagesService } from './debug-messages-services/debug-messages.service';
import {
  DebugMessagesStorage,
  DEBUG_MESSAGES_STORAGE,
} from './debug-messages-services/debug-messages.storage';
import { DebugService } from './debug-messages-services/debug.service';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  providers: [
    { provide: DEBUG_MESSAGES_STORAGE, useClass: DebugMessagesStorage },
    DebugService,
  ],
  exports: [
    TranslatesModule,
    BotCommandsModule,
    DEBUG_MESSAGES_STORAGE,
    DebugService,
  ],
})
export class DebugMessagesModuleCore {}

@Module({
  imports: [DebugMessagesModuleCore],
  exports: [DebugMessagesModuleCore],
})
export class DebugMessagesModule {
  static forRoot(): DynamicModule {
    return {
      module: DebugMessagesModule,
      imports: [
        CustomInjectorModule.forFeature({
          imports: [DebugMessagesModule],
          providers: [
            {
              provide: DEBUG_MESSAGES_CONFIG,
              useValue: <DebugMessagesConfig>{
                title: getText('Debug messages'),
                name: 'debug',
                usage: [
                  getText('debug on'),
                  getText('debug off'),
                  getText('debug state'),
                  getText('debug help'),
                ],
                descriptions: getText(
                  'Commands for enable and disable debug mode'
                ),
                spyWords: [getText('debug')],
                category: [BotCommandsCategory.system],
              },
            },
            {
              provide: BOT_COMMANDS_PROVIDER,
              useClass: DebugMessagesService,
            },
          ],
          exports: [DEBUG_MESSAGES_CONFIG],
        }),
      ],
    };
  }
}
