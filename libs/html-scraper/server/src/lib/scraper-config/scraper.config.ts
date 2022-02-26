export const SCRAPER_CONFIG = 'SCRAPER_CONFIG';

export interface ScraperConfig {
  uri: string;
  timeout?: number;
  contentSelector: string;
  contentLength?: number;
  contentCodepage?: string;
  spyWords: string[];
  removeWords?: string[];
  help: string;
  helpLocale?: { [locale: string]: string };
}
