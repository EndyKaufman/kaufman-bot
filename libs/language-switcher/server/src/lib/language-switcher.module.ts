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
  LanguageSwitcherConfig,
  LANGUAGE_SWITCHER_CONFIG,
} from './language-switcher-config/language-switcher.config';
import { LanguageSwitcherService } from './language-switcher-services/language-switcher.service';
import {
  LanguageSwitcherStorage,
  LANGUAGE_SWITCHER_STORAGE,
} from './language-switcher-services/language-switcher.storage';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  providers: [
    { provide: LANGUAGE_SWITCHER_STORAGE, useClass: LanguageSwitcherStorage },
    LanguageSwitcherStorage,
  ],
  exports: [TranslatesModule, BotCommandsModule, LANGUAGE_SWITCHER_STORAGE],
})
export class LanguageSwitcherModuleCore {}

@Module({
  imports: [LanguageSwitcherModuleCore],
  exports: [LanguageSwitcherModuleCore],
})
export class LanguageSwitcherModule {
  static forRoot(): DynamicModule {
    return {
      module: LanguageSwitcherModule,
      imports: [
        CustomInjectorModule.forFeature({
          imports: [LanguageSwitcherModule],
          providers: [
            {
              provide: LANGUAGE_SWITCHER_CONFIG,
              useValue: <LanguageSwitcherConfig>{
                title: getText('Language switcher'),
                name: 'locale',
                usage: [
                  getText('my locale'),
                  getText('change locale to ru'),
                  getText('locale help'),
                ],
                descriptions: getText(
                  'Commands for setting and changing the current user language'
                ),
                spyWords: [getText('lang'), getText('locale')],
                removeWords: [
                  getText('change'),
                  getText('please'),
                  getText('to'),
                  getText('to-alt'),
                ],
                category: [BotCommandsCategory.system],
              },
            },
            {
              provide: BOT_COMMANDS_PROVIDER,
              useClass: LanguageSwitcherService,
            },
          ],
          exports: [LANGUAGE_SWITCHER_CONFIG],
        }),
      ],
    };
  }
}
