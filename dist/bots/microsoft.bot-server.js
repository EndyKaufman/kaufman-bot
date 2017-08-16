"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_bot_server_1 = require("../lib/base.bot-server");
const scraper_plugin_1 = require("../plugins/scraper.plugin");
const wiki_plugin_1 = require("../plugins/wiki.plugin");
const api_ai_plugin_1 = require("../plugins/api-ai.plugin");
const microsoft_bot_1 = require("./microsoft.bot");
class MicrosoftBotServer extends base_bot_server_1.BaseBotServer {
    constructor(name, server) {
        super(name);
        this.name = name;
        this.server = server;
        this.botToken = this.env('MICROSOFT_APP_ID');
        this.botPassword = this.env('MICROSOFT_APP_PASSWORD');
        this.bot = new microsoft_bot_1.MicrosoftBot(this.botToken, this.botPassword);
        this.plugins.push(new scraper_plugin_1.ScraperPlugin(this.env('BOT_NAME_ALIASES', 'bot').split(','), this.env('SCRAPER_BASHORG_URI'), this.env('SCRAPER_BASHORG_TIMEOUT', 10000), this.env('SCRAPER_BASHORG_CONTENT_SELECTOR'), this.env('SCRAPER_BASHORG_CONTENT_LENGTH', 1000), this.env('SCRAPER_BASHORG_SPY_WORDS', 'bashorg').split(','), this.env('SCRAPER_BASHORG_WHAT_CAN_I_DO_EN'), this.env('SCRAPER_BASHORG_WHAT_CAN_I_DO_RU')));
        this.plugins.push(new scraper_plugin_1.ScraperPlugin(this.env('BOT_NAME_ALIASES', 'bot').split(','), this.env('SCRAPER_PING_URI'), this.env('SCRAPER_PING_TIMEOUT', 10000), this.env('SCRAPER_PING_CONTENT_SELECTOR'), this.env('SCRAPER_PING_CONTENT_LENGTH', 1000), this.env('SCRAPER_PING_SPY_WORDS', 'ping').split(','), this.env('SCRAPER_PING_WHAT_CAN_I_DO_EN'), this.env('SCRAPER_PING_WHAT_CAN_I_DO_RU')));
        this.plugins.push(new wiki_plugin_1.WikIBotPlugin(this.env('BOT_LOCALE'), this.env('BOT_NAME_ALIASES', 'bot').split(','), this.env('WIKIPEDIA_CONTENT_LENGTH', 1000), this.env('WIKIPEDIA_SPY_WORDS', 'wiki').split(',')));
        this.plugins.push(new api_ai_plugin_1.ApiAIBotPlugin(this.env('BOT_NAME_ALIASES', 'bot').split(','), this.env('APIAI_CLIENT_ACCESS_TOKEN')));
    }
    processUpdate() {
        this.webServer.app.post(this.actionUrl, this.bot.originalConnector.listen());
    }
    get actionUrl() {
        return `/bot${this.botToken.split('-').join('')}`;
    }
}
exports.MicrosoftBotServer = MicrosoftBotServer;
