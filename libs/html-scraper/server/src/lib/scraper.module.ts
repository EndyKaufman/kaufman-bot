import { CommandToolsModule } from '@kaufman-bot/core/server';
import { DynamicModule, Module } from '@nestjs/common';
import { TranslatesModule } from 'nestjs-translates';
import { ScraperConfig, SCRAPER_CONFIG } from './scraper-config/scraper.config';
import { ScraperService } from './scraper-services/scraper.service';

@Module({
  imports: [TranslatesModule, CommandToolsModule],
  exports: [TranslatesModule, CommandToolsModule],
})
export class ScraperModule {
  static forRoot(config: ScraperConfig): DynamicModule {
    return {
      module: ScraperModule,
      providers: [
        {
          provide: SCRAPER_CONFIG,
          useValue: config,
        },
        ScraperService,
      ],
      exports: [ScraperService],
    };
  }
}
