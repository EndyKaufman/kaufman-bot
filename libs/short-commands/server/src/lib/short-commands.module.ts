import {
  BotCommandsCategory,
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
  BOT_COMMANDS_TOOLS_INTERCEPTOR,
} from '@kaufman-bot/core-server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesModule } from 'nestjs-translates';
import {
  ShortCommandsConfig,
  SHORT_COMMANDS_CONFIG,
} from './short-commands-config/short-commands.config';
import { ShortCommandsToolsService } from './short-commands-services/short-commands-tools.service';
import { ShortCommandsBotCommandsToolsInterceptor } from './short-commands-services/short-commands.bot-commands-tools-interceptor';
import { ShortCommandsService } from './short-commands-services/short-commands.service';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  providers: [ShortCommandsToolsService],
  exports: [TranslatesModule, BotCommandsModule, ShortCommandsToolsService],
})
export class ShortCommandsModuleCore {}

@Module({
  imports: [ShortCommandsModuleCore],
  exports: [ShortCommandsModuleCore],
})
export class ShortCommandsModule {
  static forRoot(config: Pick<ShortCommandsConfig, 'commands'>): DynamicModule {
    return {
      module: ShortCommandsModule,
      providers: [
        {
          provide: SHORT_COMMANDS_CONFIG,
          useValue: <ShortCommandsConfig>{
            title: getText('Short commands'),
            name: 'scmd',
            usage: [getText('scmd state'), getText('scmd help')],
            descriptions: getText(
              'Shortened versions of commands for quick launch'
            ),
            spyWords: [getText('scmd')],
            commands: config.commands,
            category: BotCommandsCategory.system,
          },
        },
        {
          provide: BOT_COMMANDS_PROVIDER,
          useClass: ShortCommandsService,
        },
        {
          provide: BOT_COMMANDS_TOOLS_INTERCEPTOR,
          useClass: ShortCommandsBotCommandsToolsInterceptor,
        },
      ],
    };
  }
}
