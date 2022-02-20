import { DynamicModule, Module } from '@nestjs/common';
import { ScraperConfig, SCRAPER_CONFIG } from './scraper-config/scraper.config';
import { ScraperService } from './scraper-services/scraper.service';

@Module({})
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
    };
  }
}
