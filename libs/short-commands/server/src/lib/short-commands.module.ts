import {
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
} from '@kaufman-bot/core/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesModule } from 'nestjs-translates';
import {
  ShortCommandsConfig,
  SHORT_COMMANDS_CONFIG,
} from './short-commands-config/short-commands.config';
import { ShortCommandsService } from './short-commands-services/short-commands.service';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  exports: [TranslatesModule, BotCommandsModule],
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
          },
        },
        {
          provide: BOT_COMMANDS_PROVIDER,
          useClass: ShortCommandsService,
        },
      ],
    };
  }
}
