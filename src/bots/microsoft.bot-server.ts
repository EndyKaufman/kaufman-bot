import { BaseBotServer } from '../lib/base.bot-server';
import { ScraperPlugin } from '../plugins/scraper.plugin';
import { WikIBotPlugin } from '../plugins/wiki.plugin';
import { ApiAIBotPlugin } from '../plugins/api-ai.plugin';
import { IBotPlugin, IBot, IBotMessage } from '../lib/interfaces';
import { EventEmitter } from 'events';
import { IWebServer } from '../lib/interfaces';

import builder = require('botbuilder');

export class MicrosoftBot implements IBot {
    protected onEvent: EventEmitter;
    protected onSendMessage: EventEmitter;
    public originalConnector: any;
    public originalBot: any;
    constructor(appId: string, appPassword: string) {
        this.onEvent = new EventEmitter();
        this.onSendMessage = new EventEmitter();
        this.originalConnector = new builder.ChatConnector({
            appId: appId,
            appPassword: appPassword
        });
        this.originalBot = new builder.UniversalBot(this.originalConnector, (session: any) => {
            const msg: IBotMessage = {
                text: session.message.text,
                chat: {
                    id: session.message.address.id,
                    type: 'private'
                },
                originalData: session.message,
                provider: 'microsoft'
            };
            this.onSendMessage.on('message', (chatId: number | string, text: string, options?: any) => {
                if (chatId === session.message.address.id) {
                    session.send(text);
                }
            });
            this.onEvent.emit('message', msg);
        });
    }
    processUpdate(update: any) {
        return true;
    }
    sendMessage(chatId: number | string, text: string, options?: any): any {
        this.onSendMessage.emit('message', chatId, text, options);
        return true;
    }
    setWebHook(url: string, options?: any): any {
        return true;
    }
    on(event: string | symbol, listener: (...args: any[]) => void): any {
        return this.onEvent.on(event, listener);
    }
    emit(event: string | symbol, ...args: any[]): boolean {
        return this.onEvent.emit(event, ...args);
    }
}
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
    protected get actionUrl() {
        return `/bot${this.botToken.split('-').join('')}`;
    }
}
