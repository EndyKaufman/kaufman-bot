import { BaseBot } from './lib/base.bot';
import TelegramBot = require('node-telegram-bot-api');
import { ApiAiPlugin } from './plugins/api-ai.plugin';
import { WikiPlugin } from './plugins/wiki.plugin';
import { ScraperPlugin } from './plugins/scraper.plugin';

export class Bot extends BaseBot {
    constructor(protected name?: string) {
        super(name);
        this.botToken = this.env('TELEGRAM_TOKEN');
        this.botHookUrl = this.env('TELEGRAM_HOOK_URL');
        this.bot = new TelegramBot(this.botToken, { polling: true });
        // Include plugins
        this.plugins.push(new ScraperPlugin(
            this.bot,
            this.env('TELEGRAM_BOT_NAME_ALIASES', 'bot').split(','),
            this.env('SCRAPER_PING_URI'),
            this.env('SCRAPER_PING_TIMEOUT', 10000),
            this.env('SCRAPER_PING_CONTENT_SELECTOR'),
            this.env('SCRAPER_PING_CONTENT_LENGTH', 1000),
            this.env('SCRAPER_PING_SPY_WORDS', 'ping').split(',')
        ));
        this.plugins.push(new WikiPlugin(
            this.bot,
            this.env('TELEGRAM_BOT_LOCALE'),
            this.env('TELEGRAM_BOT_NAME_ALIASES', 'bot').split(','),
            this.env('WIKIPEDIA_CONTENT_LENGTH', 1000),
            this.env('WIKIPEDIA_SPY_WORDS', 'wiki').split(',')
        ));
        this.plugins.push(new ApiAiPlugin(
            this.bot,
            this.env('TELEGRAM_BOT_NAME_ALIASES', 'bot').split(','),
            this.env('APIAI_CLIENT_ACCESS_TOKEN')
        ));
    }
}