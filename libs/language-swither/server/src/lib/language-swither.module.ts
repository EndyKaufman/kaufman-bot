import { CommandToolsModule } from '@kaufman-bot/core/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesModule } from 'nestjs-translates';
import {
  LanguageSwitherConfig,
  LANGUAGE_SWITHER_CONFIG,
} from './language-swither-config/language-swither.config';
import { LanguageSwitherService } from './language-swither-services/language-swither.service';

@Module({
  imports: [TranslatesModule, CommandToolsModule],
  exports: [TranslatesModule, CommandToolsModule],
})
export class LanguageSwitherModule {
  static forRoot(): DynamicModule {
    return {
      module: LanguageSwitherModule,
      providers: [
        {
          provide: LANGUAGE_SWITHER_CONFIG,
          useValue: <LanguageSwitherConfig>{
            name: getText('Language swither'),
            usage: [
              getText('my locale'),
              getText('change locale to ru'),
              getText('locale help'),
            ],
            descriptions: getText(
              'Commands for setting and changing the current user language'
            ),
            spyWords: [getText('lang'), getText('locale')],
            removeWords: [getText('change'), getText('please'), getText('to')],
          },
        },
        LanguageSwitherService,
      ],
      exports: [LanguageSwitherService],
    };
  }
}
