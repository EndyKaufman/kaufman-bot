"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timers_1 = require("timers");
const events_1 = require("events");
class BaseBot {
    constructor(name) {
        this.name = name;
        this.plugins = [];
    }
    get namePrefix() {
        return this.name === undefined ? '' : this.name.toUpperCase() + '_';
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
    startEndpoint(server) {
        server.app.post(`/bot${this.botToken}`, (req, res) => {
            this.bot.processUpdate(req.body);
            res.sendStatus(200);
        });
        if (this.botHookUrl) {
            this.bot.setWebHook(`${this.botHookUrl}/bot${this.botToken}`);
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
exports.BaseBot = BaseBot;
