import { BaseBotServer } from '../lib/base.bot-server';
import { ScraperPlugin } from '../plugins/scraper.plugin';
import { WikIBotPlugin } from '../plugins/wiki.plugin';
import { ApiAIBotPlugin } from '../plugins/api-ai.plugin';
import { IBotPlugin, IBot } from '../lib/interfaces';
import { IWebServer } from '../lib/interfaces';
import { MicrosoftBot } from './microsoft.bot';

export class MicrosoftBotServer extends BaseBotServer {
    protected bot: MicrosoftBot;
    protected botPassword: string;
    protected processUpdate() {
        this.webServer.app.post(this.actionUrl, this.bot.originalConnector.listen());
    }
    constructor(protected name?: string, protected server?: IWebServer) {
        super(name);
        this.botToken = this.env('MICROSOFT_APP_ID');
        this.botPassword = this.env('MICROSOFT_APP_PASSWORD');
        this.bot = new MicrosoftBot(
            this.botToken,
            this.botPassword
        );
        // Include plugins
        this.plugins.push(new ScraperPlugin(
            this.env('BOT_NAME_ALIASES', 'bot').split(','),
            this.env('SCRAPER_BASHORG_URI'),
            this.env('SCRAPER_BASHORG_TIMEOUT', 10000),
            this.env('SCRAPER_BASHORG_CONTENT_SELECTOR'),
            this.env('SCRAPER_BASHORG_CONTENT_LENGTH', 1000),
            this.env('SCRAPER_BASHORG_SPY_WORDS', 'bashorg').split(','),
            this.env('SCRAPER_BASHORG_WHAT_CAN_I_DO_EN'),
            this.env('SCRAPER_BASHORG_WHAT_CAN_I_DO_RU')
        ));
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
    protected get actionUrl() {
        return `/bot${this.botToken.split('-').join('')}`;
    }
}
