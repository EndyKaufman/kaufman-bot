"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_bot_server_1 = require("../lib/base.bot-server");
const scraper_plugin_1 = require("../plugins/scraper.plugin");
const wiki_plugin_1 = require("../plugins/wiki.plugin");
const api_ai_plugin_1 = require("../plugins/api-ai.plugin");
const events_1 = require("events");
const builder = require('botbuilder');
class MicrosoftBot {
    constructor(appId, appPassword) {
        this.event = new events_1.EventEmitter();
        this.originalConnector = new builder.ChatConnector({
            appId: appId,
            appPassword: appPassword
        });
        this.originalBot = new builder.UniversalBot(this.originalConnector);
    }
    processUpdate(update) {
        console.log(update);
    }
    sendMessage(chatId, text, options) {
        const promise = new Promise((resolve, reject) => {
            resolve(true);
        });
        console.log(chatId, text, options);
        return promise;
    }
    setWebHook(url, options) {
        const promise = new Promise((resolve, reject) => {
            resolve(true);
        });
        console.log(url, options);
        return promise;
    }
    on(event, listener) {
        return this;
    }
    emit(event, ...args) {
        return true;
    }
}
exports.MicrosoftBot = MicrosoftBot;
class MicrosoftBotServer extends base_bot_server_1.BaseBotServer {
    constructor(name) {
        super(name);
        this.name = name;
        this.botToken = this.env('MICROSOFT_APP_ID');
        this.botPassword = this.env('MICROSOFT_APP_PASSWORD');
        this.bot = new MicrosoftBot(this.botToken, this.botPassword);
        this.plugins.push(new scraper_plugin_1.ScraperPlugin(this.env('BOT_NAME_ALIASES', 'bot').split(','), this.env('SCRAPER_PING_URI'), this.env('SCRAPER_PING_TIMEOUT', 10000), this.env('SCRAPER_PING_CONTENT_SELECTOR'), this.env('SCRAPER_PING_CONTENT_LENGTH', 1000), this.env('SCRAPER_PING_SPY_WORDS', 'ping').split(',')));
        this.plugins.push(new wiki_plugin_1.WikIBotPlugin(this.env('BOT_LOCALE'), this.env('BOT_NAME_ALIASES', 'bot').split(','), this.env('WIKIPEDIA_CONTENT_LENGTH', 1000), this.env('WIKIPEDIA_SPY_WORDS', 'wiki').split(',')));
        this.plugins.push(new api_ai_plugin_1.ApiAIBotPlugin(this.env('BOT_NAME_ALIASES', 'bot').split(','), this.env('APIAI_CLIENT_ACCESS_TOKEN')));
    }
}
exports.MicrosoftBotServer = MicrosoftBotServer;
