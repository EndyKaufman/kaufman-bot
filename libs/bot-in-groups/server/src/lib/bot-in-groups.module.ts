import {
  BotCommandsCategory,
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
} from '@kaufman-bot/core-server';
import { LanguageSwitherModule } from '@kaufman-bot/language-swither-server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesModule } from 'nestjs-translates';
import {
  BotInGroupsConfigurableModuleClass,
  BOT_IN_GROUPS_ASYNC_OPTIONS_TYPE,
  BOT_IN_GROUPS_CONFIG,
  BOT_IN_GROUPS_OPTIONS_TYPE,
} from './bot-in-groups-config/bot-in-groups.config';
import { BotInGroupsProcessorService } from './bot-in-groups-services/bot-in-groups-processor.service';
import { BotInGroupsService } from './bot-in-groups-services/bot-in-groups.service';

@Module({
  imports: [TranslatesModule, BotCommandsModule, LanguageSwitherModule],
  exports: [TranslatesModule, BotCommandsModule, LanguageSwitherModule],
})
export class BotInGroupsModule extends BotInGroupsConfigurableModuleClass {
  static forRoot(options: typeof BOT_IN_GROUPS_OPTIONS_TYPE): DynamicModule {
    return {
      ...this.forRootAsync({
        useFactory: async () => options,
      }),
    };
  }

  static forRootAsync(
    options: typeof BOT_IN_GROUPS_ASYNC_OPTIONS_TYPE
  ): DynamicModule {
    const useFactory = options.useFactory;
    const useClass = options.useClass;
    if (options.useExisting) {
      throw new Error(`options.useExisting is not supported!`);
    }
    return {
      module: BotInGroupsModule,
      imports: options.imports || [],
      providers: [
        ...(useClass
          ? [
              { provide: `${String(BOT_IN_GROUPS_CONFIG)}_TEMP`, useClass },
              {
                provide: BOT_IN_GROUPS_CONFIG,
                useFactory: async (config) => this.patchConfig(config),
                inject: [`${String(BOT_IN_GROUPS_CONFIG)}_TEMP`],
              },
            ]
          : []),
        ...(useFactory
          ? [
              {
                provide: BOT_IN_GROUPS_CONFIG,
                useFactory: async (...args) =>
                  this.patchConfig(await useFactory(...args)),
                inject: options.inject || [],
              },
            ]
          : []),
        {
          provide: BOT_COMMANDS_PROVIDER,
          useClass: BotInGroupsService,
        },
        BotInGroupsProcessorService,
      ],
      exports: [BotInGroupsProcessorService],
    };
  }

  private static patchConfig(config: typeof BOT_IN_GROUPS_OPTIONS_TYPE) {
    return {
      ...config,
      title: getText('Bot in groups'),
      name: 'groups',
      descriptions: getText('Commands for support work the bot in groups'),
      usage: [getText('groups help'), getText('groups meet')],
      spyWords: [getText('groups')],
      category: BotCommandsCategory.system,
    };
  }
}
