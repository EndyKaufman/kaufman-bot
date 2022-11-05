import { DynamicModule, Module } from '@nestjs/common';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { TranslatesModule } from 'nestjs-translates';
import {
  BotCommandsConfig,
  BOT_COMMANDS_CONFIG,
} from './bot-commands-config/bot-commands.config';
import { BotCommandsBotinfoService } from './bot-commands-services/bot-commands-botinfo.service';
import { BotCommandsInMemoryStorage } from './bot-commands-services/bot-commands-in-memory.storage';
import { BotCommandsToolsService } from './bot-commands-services/bot-commands-tools.service';
import { BotCommandsService } from './bot-commands-services/bot-commands.service';
import { BOT_COMMANDS_PROVIDER } from './bot-commands-types/bot-commands-provider.interface';
import { BOT_COMMANDS_STORAGE } from './bot-commands-types/bot-commands-storage.provider';
@Module({
  imports: [CustomInjectorModule, TranslatesModule],
  providers: [BotCommandsToolsService, BotCommandsService],
  exports: [
    CustomInjectorModule,
    TranslatesModule,
    BotCommandsToolsService,
    BotCommandsService,
  ],
})
export class BotCommandsModuleCore {}
@Module({
  imports: [BotCommandsModuleCore],
  exports: [BotCommandsModuleCore],
})
export class BotCommandsModule {
  static forRoot(config?: BotCommandsConfig): DynamicModule {
    return {
      module: BotCommandsModule,
      providers: [
        {
          provide: BOT_COMMANDS_CONFIG,
          useValue: <BotCommandsConfig>{
            maxRecursiveDepth: 5,
            ...(config || {}),
          },
        },
        {
          provide: BOT_COMMANDS_STORAGE,
          useClass: BotCommandsInMemoryStorage,
        },
        {
          provide: BOT_COMMANDS_PROVIDER,
          useClass: BotCommandsBotinfoService,
        },
      ],
      exports: [BOT_COMMANDS_CONFIG, BOT_COMMANDS_STORAGE],
    };
  }
}
