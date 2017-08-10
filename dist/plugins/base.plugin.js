"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const utils_1 = require("../utils");
class BasePlugin {
    constructor(bot) {
        this.bot = bot;
        this.botLocale = process.env.TELEGRAM_BOT_LOCALE;
    }
    check(msg) {
        return utils_1.checkWordsInMessage(msg.text, this.wordsForSpy) || msg.chat.type === 'private';
    }
    process(msg) {
        const event = new events_1.EventEmitter();
        setTimeout(item => event.emit('message', 'Hi!'), 700);
        return event;
    }
}
exports.BasePlugin = BasePlugin;
