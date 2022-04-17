import {
  BotCommandsCategory,
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
} from '@kaufman-bot/core-server';
import { DebugMessagesModule } from '@kaufman-bot/debug-messages-server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { TranslatesModule } from 'nestjs-translates';
import {
  DialogflowConfig,
  DIALOGFLOW_CONFIG,
} from './dialogflow-config/dialogflow.config';
import { DialogflowService } from './dialogflow-services/dialogflow.service';
import {
  DialogflowStorage,
  DIALOGFLOW_STORAGE,
} from './dialogflow-services/dialogflow.storage';

@Module({
  imports: [TranslatesModule, BotCommandsModule, DebugMessagesModule],
  providers: [{ provide: DIALOGFLOW_STORAGE, useClass: DialogflowStorage }],
  exports: [
    TranslatesModule,
    BotCommandsModule,
    DebugMessagesModule,
    DIALOGFLOW_STORAGE,
  ],
})
export class DialogflowModule {
  static forRoot(config: Pick<DialogflowConfig, 'projectId'>): DynamicModule {
    return {
      module: DialogflowModule,
      imports: [
        CustomInjectorModule.forFeature({
          imports: [DialogflowModule],
          providers: [
            {
              provide: DIALOGFLOW_CONFIG,
              useValue: <DialogflowConfig>{
                ...config,
                title: getText('Dialogflow'),
                name: 'dialogflow',
                usage: [
                  getText('dialog hello'),
                  getText('ai hello'),
                  getText('dialog help'),
                  getText('ai help'),
                ],
                descriptions: getText(
                  'Commands for process request with Dialogflow intents'
                ),
                spyWords: [getText('dialog'), getText('ai')],
                category: BotCommandsCategory.system,
              },
            },
            {
              provide: BOT_COMMANDS_PROVIDER,
              useClass: DialogflowService,
            },
          ],
          exports: [DIALOGFLOW_CONFIG],
        }),
      ],
    };
  }
}
