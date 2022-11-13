export const LANGUAGE_SWITCHER_CONFIG = 'LANGUAGE_SWITCHER_CONFIG';

export interface LanguageSwitcherConfig {
  title: string;
  name: string;
  descriptions: string;
  usage: string[];
  spyWords: string[];
  removeWords?: string[];
  category: string[];
}
