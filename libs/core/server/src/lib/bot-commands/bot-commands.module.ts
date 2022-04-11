import { DynamicModule, Module } from '@nestjs/common';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { TranslatesModule } from 'nestjs-translates';
import {
  BotCommandsConfig,
  BOT_COMMANDS_CONFIG,
} from './bot-commands-config/bot-commands.config';
import { BotCommandsToolsService } from './bot-commands-services/bot-commands-tools.service';
import { BotCommandsService } from './bot-commands-services/bot-commands.service';

@Module({
  imports: [CustomInjectorModule, TranslatesModule],
  providers: [BotCommandsToolsService],
  exports: [CustomInjectorModule, TranslatesModule, BotCommandsToolsService],
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
        BotCommandsService,
      ],
      exports: [BOT_COMMANDS_CONFIG, BotCommandsService],
    };
  }
}
