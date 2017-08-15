import { BaseBotServer } from '../lib/base.bot-server';
import { ScraperPlugin } from '../plugins/scraper.plugin';
import { WikIBotPlugin } from '../plugins/wiki.plugin';
import { ApiAIBotPlugin } from '../plugins/api-ai.plugin';
import { IBotPlugin } from '../lib/interfaces';
const TelegramBot = require('node-telegram-bot-api');

export class TelegramBotServer extends BaseBotServer {
    constructor(protected name?: string) {
        super(name);
        this.botToken = this.env('TELEGRAM_TOKEN');
        this.botHookUrl = this.env('TELEGRAM_HOOK_URL');
        this.bot = new TelegramBot(this.botToken, { polling: true });
        // Include plugins
        this.plugins.push(new ScraperPlugin(
            this.env('BOT_NAME_ALIASES', 'bot').split(','),
            this.env('SCRAPER_PING_URI'),
            this.env('SCRAPER_PING_TIMEOUT', 10000),
            this.env('SCRAPER_PING_CONTENT_SELECTOR'),
            this.env('SCRAPER_PING_CONTENT_LENGTH', 1000),
            this.env('SCRAPER_PING_SPY_WORDS', 'ping').split(','),
            this.env('SCRAPER_PING_WHAT_CAN_I_DO_EN'),
            this.env('SCRAPER_PING_WHAT_CAN_I_DO_RU')
        ));
        this.plugins.push(new WikIBotPlugin(
            this.env('BOT_LOCALE'),
            this.env('BOT_NAME_ALIASES', 'bot').split(','),
            this.env('WIKIPEDIA_CONTENT_LENGTH', 1000),
            this.env('WIKIPEDIA_SPY_WORDS', 'wiki').split(',')
        ));
        this.plugins.push(new ApiAIBotPlugin(
            this.env('BOT_NAME_ALIASES', 'bot').split(','),
            this.env('APIAI_CLIENT_ACCESS_TOKEN')
        ));
    }
}
