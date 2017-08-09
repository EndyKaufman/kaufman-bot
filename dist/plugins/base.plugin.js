"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const _ = require("lodash");
class BasePlugin {
    constructor(bot) {
        this.bot = bot;
        this.botLocale = process.env.TELEGRAM_BOT_LOCALE;
    }
    checkWordsForSpyInMessage(message, words) {
        words = words === undefined ? this.wordsForSpy : words;
        const messageWords = _.words((message ? message : '').toLowerCase());
        return words.filter(word => messageWords.indexOf((word ? word : '').toLowerCase()) !== -1).length > 0;
    }
    removeWordsForSpyFromMessage(message, words) {
        words = words === undefined ? this.wordsForSpy : words;
        words.map(word => message = message.replace(new RegExp(word, "ig"), ''));
        return message;
    }
    process(msg) {
        const event = new events_1.EventEmitter();
        setTimeout(item => event.emit('message', 'Hi!'), 700);
        return event;
    }
}
exports.BasePlugin = BasePlugin;
