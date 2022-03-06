export const SCRAPER_CONFIG = 'SCRAPER_CONFIG';

export interface ScraperConfig {
  uri: string;
  timeout?: number;
  contentSelector: string;
  contentLength?: number;
  contentCodepage?: string;
  spyWords: string[];
  removeWords?: string[];
  name: string;
  descriptions: string;
  usage: string[];
}
