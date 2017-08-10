"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_bot_1 = require("./lib/base.bot");
const TelegramBot = require("node-telegram-bot-api");
const api_ai_plugin_1 = require("./plugins/api-ai.plugin");
const wiki_plugin_1 = require("./plugins/wiki.plugin");
class Bot extends base_bot_1.BaseBot {
    constructor(name) {
        super(name);
        this.name = name;
        this.botToken = process.env[this.namePrefix + 'TELEGRAM_TOKEN'];
        this.botHookUrl = process.env[this.namePrefix + 'TELEGRAM_HOOK_URL'];
        this.bot = new TelegramBot(this.botToken, { polling: true });
        this.plugins.push(new wiki_plugin_1.WikiPlugin(this.bot, process.env[this.namePrefix + 'TELEGRAM_BOT_LOCALE'], process.env[this.namePrefix + 'TELEGRAM_BOT_NAME_ALIASES'].split(','), process.env[this.namePrefix + 'WIKIPEDIA_SPY_WORDS'].split(',')));
        this.plugins.push(new api_ai_plugin_1.ApiAiPlugin(this.bot, process.env[this.namePrefix + 'TELEGRAM_BOT_NAME_ALIASES'].split(','), process.env[this.namePrefix + 'APIAI_CLIENT_ACCESS_TOKEN']));
    }
}
exports.Bot = Bot;
