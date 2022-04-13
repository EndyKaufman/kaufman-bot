export const SCRAPER_CONFIG = 'SCRAPER_CONFIG';

export interface ScraperConfig {
  title: string;
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
  headers?: Record<string, string>[];
  contextUsage?: string[];
  category: string;
}
