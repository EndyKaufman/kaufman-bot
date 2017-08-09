"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class BasePlugin {
    constructor(bot) {
        this.bot = bot;
    }
    checkWordsForSpyInMessage(message, words) {
        words = words === undefined ? this.wordsForSpy : words;
        return words.filter(word => message.toLowerCase().indexOf(word.toLowerCase()) !== -1).length > 0;
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
