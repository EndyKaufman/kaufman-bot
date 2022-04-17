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
  LanguageSwitherConfig,
  LANGUAGE_SWITHER_CONFIG,
} from './language-swither-config/language-swither.config';
import { LanguageSwitherService } from './language-swither-services/language-swither.service';
import {
  LanguageSwitherStorage,
  LANGUAGE_SWITHER_STORAGE,
} from './language-swither-services/language-swither.storage';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  providers: [
    { provide: LANGUAGE_SWITHER_STORAGE, useClass: LanguageSwitherStorage },
    LanguageSwitherStorage,
  ],
  exports: [TranslatesModule, BotCommandsModule, LANGUAGE_SWITHER_STORAGE],
})
export class LanguageSwitherModule {
  static forRoot(): DynamicModule {
    return {
      module: LanguageSwitherModule,
      imports: [
        CustomInjectorModule.forFeature({
          imports: [LanguageSwitherModule],
          providers: [
            {
              provide: LANGUAGE_SWITHER_CONFIG,
              useValue: <LanguageSwitherConfig>{
                title: getText('Language swither'),
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
                category: BotCommandsCategory.system,
              },
            },
            {
              provide: BOT_COMMANDS_PROVIDER,
              useClass: LanguageSwitherService,
            },
          ],
          exports: [LANGUAGE_SWITHER_CONFIG],
        }),
      ],
    };
  }
}
