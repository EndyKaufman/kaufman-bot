import { BaseBotServer } from '../lib/base.bot-server';
import { ScraperBotPlugin } from '../plugins/scraper.plugin';
import { WikiBotPlugin } from '../plugins/wiki.plugin';
import { ApiAiBotPlugin } from '../plugins/api-ai.plugin';
import { IBotPlugin, IBot } from '../lib/interfaces';
import { IWebServer } from '../lib/interfaces';
import { MicrosoftBot } from './microsoft.bot';
import { IBotMessage } from '../lib/interfaces';
import { GoogleApisBotPlugin } from '../plugins/google-apis.plugin';

const stringify = require('json-stringify-safe');

export class MicrosoftBotServer extends BaseBotServer {
  protected bot: MicrosoftBot;
  protected botPassword: string;
  protected processUpdate() {
    this.webServer.app.post(this.actionUrl, this.bot.originalConnector.processActivity);
  }
  constructor(protected name: string, protected envName?: string) {
    super(name, envName);
    this.botToken = this.env('MICROSOFT_APP_ID');
    this.botPassword = this.env('MICROSOFT_APP_PASSWORD');
    this.bot = new MicrosoftBot(this.botToken, this.botPassword);
    // Include plugins
    this.plugins.push(
      new GoogleApisBotPlugin(
        this.env('BOT_LOCALE'),
        this.env('BOT_NAME_ALIASES', 'bot').split(','),
        this.env('GOOGLE_APIS_API_KEY'),
        this.env('GOOGLE_APIS_HABR_CUSTOM_SEARCH_ENGINE_ID'),
        this.env('GOOGLE_APIS_HABR_SEARCH_QUERY_PREFIX'),
        this.env('GOOGLE_APIS_HABR_SEARCH_SPY_WORDS', 'search').split(','),
        this.env('GOOGLE_APIS_HABR_WHAT_CAN_I_DO_EN'),
        this.env('GOOGLE_APIS_HABR_WHAT_CAN_I_DO_RU')
      )
    );
    this.plugins.push(
      new ScraperBotPlugin(
        this.env('BOT_LOCALE'),
        this.env('BOT_NAME_ALIASES', 'bot').split(','),
        this.env('SCRAPER_FORISMATIC_URI'),
        this.env('SCRAPER_FORISMATIC_TIMEOUT', 10000),
        this.env('SCRAPER_FORISMATIC_CONTENT_SELECTOR'),
        this.env('SCRAPER_FORISMATIC_CONTENT_LENGTH', 1000),
        'windows-1251',
        this.env('SCRAPER_FORISMATIC_SPY_WORDS', 'quote').split(','),
        this.env('SCRAPER_FORISMATIC_WHAT_CAN_I_DO_EN'),
        this.env('SCRAPER_FORISMATIC_WHAT_CAN_I_DO_RU')
      )
    );
    this.plugins.push(
      new ScraperBotPlugin(
        this.env('BOT_LOCALE'),
        this.env('BOT_NAME_ALIASES', 'bot').split(','),
        this.env('SCRAPER_BASHORG_URI'),
        this.env('SCRAPER_BASHORG_TIMEOUT', 10000),
        this.env('SCRAPER_BASHORG_CONTENT_SELECTOR'),
        this.env('SCRAPER_BASHORG_CONTENT_LENGTH', 1000),
        'windows-1251',
        this.env('SCRAPER_BASHORG_SPY_WORDS', 'bashorg').split(','),
        this.env('SCRAPER_BASHORG_WHAT_CAN_I_DO_EN'),
        this.env('SCRAPER_BASHORG_WHAT_CAN_I_DO_RU')
      )
    );
    this.plugins.push(
      new ScraperBotPlugin(
        this.env('BOT_LOCALE'),
        this.env('BOT_NAME_ALIASES', 'bot').split(','),
        this.env('SCRAPER_PING_URI'),
        this.env('SCRAPER_PING_TIMEOUT', 10000),
        this.env('SCRAPER_PING_CONTENT_SELECTOR'),
        this.env('SCRAPER_PING_CONTENT_LENGTH', 1000),
        null,
        this.env('SCRAPER_PING_SPY_WORDS', 'ping').split(','),
        this.env('SCRAPER_PING_WHAT_CAN_I_DO_EN'),
        this.env('SCRAPER_PING_WHAT_CAN_I_DO_RU')
      )
    );
    this.plugins.push(
      new WikiBotPlugin(
        this.env('BOT_LOCALE'),
        this.env('BOT_NAME_ALIASES', 'bot').split(','),
        this.env('WIKIPEDIA_CONTENT_LENGTH', 1000),
        this.env('WIKIPEDIA_SPY_WORDS', 'wiki').split(',')
      )
    );
    this.plugins.push(new ApiAiBotPlugin(this.env('BOT_LOCALE'), this.env('BOT_NAME_ALIASES', 'bot').split(','), this.env('APIAI_CLIENT_ACCESS_TOKEN')));
  }
  protected get actionUrl() {
    return `/bot${this.botToken.split('-').join('')}`;
  }
}
