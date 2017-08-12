import { BaseBotServer } from '../lib/base.bot-server';
import { ScraperPlugin } from '../plugins/scraper.plugin';
import { WikIBotPlugin } from '../plugins/wiki.plugin';
import { ApiAIBotPlugin } from '../plugins/api-ai.plugin';
import { IBotPlugin, IBot } from '../lib/interfaces';
import { EventEmitter } from 'events';

const builder = require('botbuilder');

export class MicrosoftBot implements IBot {
    protected event: EventEmitter;
    protected originalConnector: any;
    protected originalBot: any;
    constructor(appId: string, appPassword: string) {
        this.event = new EventEmitter();
        this.originalConnector = new builder.ChatConnector({
            appId: appId,
            appPassword: appPassword
        });
        this.originalBot = new builder.UniversalBot(this.originalConnector);
    }
    processUpdate(update: any) {
        console.log(update);
    }
    sendMessage(chatId: number | string, text: string, options?: any): Promise<any> {
        const promise = new Promise((resolve, reject) => {
            resolve(true);
        });
        console.log(chatId, text, options);
        return promise;
    }
    setWebHook(url: string, options?: any): Promise<any> {
        const promise = new Promise((resolve, reject) => {
            resolve(true);
        });
        console.log(url, options);
        return promise;
    }
    on(event: string | symbol, listener: (...args: any[]) => void): this {
        return this;
    }
    emit(event: string | symbol, ...args: any[]): boolean {
        return true;
    }
}
export class MicrosoftBotServer extends BaseBotServer {
    protected botPassword: string;
    constructor(protected name?: string) {
        super(name);
        this.botToken = this.env('MICROSOFT_APP_ID');
        this.botPassword = this.env('MICROSOFT_APP_PASSWORD');
        this.bot = new MicrosoftBot(this.botToken, this.botPassword);
        // Include plugins
        this.plugins.push(new ScraperPlugin(
            this.env('BOT_NAME_ALIASES', 'bot').split(','),
            this.env('SCRAPER_PING_URI'),
            this.env('SCRAPER_PING_TIMEOUT', 10000),
            this.env('SCRAPER_PING_CONTENT_SELECTOR'),
            this.env('SCRAPER_PING_CONTENT_LENGTH', 1000),
            this.env('SCRAPER_PING_SPY_WORDS', 'ping').split(',')
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
