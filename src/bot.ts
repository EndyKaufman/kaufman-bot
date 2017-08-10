import { BaseBot } from './lib/base.bot';
import TelegramBot = require('node-telegram-bot-api');
import { ApiAiPlugin } from './plugins/api-ai.plugin';
import { WikiPlugin } from './plugins/wiki.plugin';
import { ScraperPlugin } from './plugins/scraper.plugin';

export class Bot extends BaseBot {
    constructor(protected name?: string) {
        super(name);
        this.botToken = process.env[this.namePrefix + 'TELEGRAM_TOKEN'];
        this.botHookUrl = process.env[this.namePrefix + 'TELEGRAM_HOOK_URL'];
        this.bot = new TelegramBot(this.botToken, { polling: true });
        // Include plugins
        this.plugins.push(new ScraperPlugin(
            this.bot,
            process.env[this.namePrefix + 'TELEGRAM_BOT_NAME_ALIASES'].split(','),
            process.env[this.namePrefix + 'SCRAPER_PING_URI'],
            process.env[this.namePrefix + 'SCRAPER_PING_TIMEOUT'],
            process.env[this.namePrefix + 'SCRAPER_PING_CONTENT_SELECTOR'],
            process.env[this.namePrefix + 'SCRAPER_PING_CONTENT_LENGTH'],
            process.env[this.namePrefix + 'SCRAPER_PING_SPY_WORDS'].split(',')
        ));
        this.plugins.push(new WikiPlugin(
            this.bot,
            process.env[this.namePrefix + 'TELEGRAM_BOT_LOCALE'],
            process.env[this.namePrefix + 'TELEGRAM_BOT_NAME_ALIASES'].split(','),
            process.env[this.namePrefix + 'WIKIPEDIA_CONTENT_LENGTH'],
            process.env[this.namePrefix + 'WIKIPEDIA_SPY_WORDS'].split(',')
        ));
        this.plugins.push(new ApiAiPlugin(
            this.bot,
            process.env[this.namePrefix + 'TELEGRAM_BOT_NAME_ALIASES'].split(','),
            process.env[this.namePrefix + 'APIAI_CLIENT_ACCESS_TOKEN']
        ));
    }
}