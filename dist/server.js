"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timers_1 = require("timers");
const events_1 = require("events");
const express = require("express");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");
const api_ai_plugin_1 = require("./plugins/api-ai.plugin");
const wiki_plugin_1 = require("./plugins/wiki.plugin");
class Server {
    constructor() {
        this.plugins = [];
        this.app = express();
        this.botToken = process.env.TELEGRAM_TOKEN;
        this.bot = new TelegramBot(this.botToken, { polling: true });
        this.plugins.push(new wiki_plugin_1.WikiPlugin(this.bot, process.env.TELEGRAM_BOT_LOCALE, process.env.TELEGRAM_BOT_NAME_ALIASES.split(','), process.env.WIKIPEDIA_SPY_WORDS.split(',')));
        this.plugins.push(new api_ai_plugin_1.ApiAiPlugin(this.bot, process.env.TELEGRAM_BOT_NAME_ALIASES.split(','), process.env.APIAI_CLIENT_ACCESS_TOKEN));
    }
    startPlugin(message, pluginName) {
        const event = new events_1.EventEmitter();
        let msg = {
            text: message,
            chat: {
                id: 'random',
                type: 'private'
            }
        };
        let founded = false;
        for (let i = 0; i < this.plugins.length; i++) {
            if (!founded &&
                (pluginName === null && this.plugins[i].check(msg)) ||
                (pluginName !== null && this.plugins[i].name === pluginName)) {
                founded = true;
                timers_1.setTimeout(() => this.plugins[i].process(msg).on('message', (answer) => {
                    event.emit('message', answer);
                }), 700);
            }
        }
        if (!founded) {
            timers_1.setTimeout(() => event.emit('message', 'empty'), 700);
        }
        return event;
    }
    start() {
        this.app.use(bodyParser.json());
        this.app.post(`/bot${this.botToken}`, (req, res) => {
            this.bot.processUpdate(req.body);
            res.sendStatus(200);
        });
        this.app.listen(process.env.PORT, () => {
            console.log(`Express server is listening on ${process.env.PORT}`);
        });
        if (process.env.TELEGRAM_HOOK_URL) {
            this.bot.setWebHook(`${process.env.TELEGRAM_HOOK_URL}/bot${this.botToken}`);
        }
        this.bot.on('message', (msg) => {
            let founded = false;
            for (let i = 0; i < this.plugins.length; i++) {
                if (!founded && this.plugins[i].check(msg)) {
                    founded = true;
                    timers_1.setTimeout(item => this.plugins[i].process(msg).on('message', (answer) => {
                        if (answer) {
                            this.bot.sendMessage(msg.chat.id, answer);
                        }
                    }), 700);
                }
            }
        });
    }
}
exports.Server = Server;
