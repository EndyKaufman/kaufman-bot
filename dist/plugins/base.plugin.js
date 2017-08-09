"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class BasePlugin {
    constructor(bot) {
        this.bot = bot;
    }
    checkWordsForSpyInMessage(message) {
        for (var i = 0; i < this.wordsForSpy.length; i++) {
            if (message.toLowerCase().indexOf(this.wordsForSpy[i].toLowerCase()) !== -1) {
                return true;
            }
        }
        return false;
    }
    removeWordsForSpyFromMessage(message) {
        for (var i = 0; i < this.wordsForSpy.length; i++) {
            message = message.replace(new RegExp(this.wordsForSpy[i], "ig"), '');
        }
        return message;
    }
    process(msg) {
        const event = new events_1.EventEmitter();
        setTimeout(_ => event.emit('message', 'Hi!'), 700);
        return event;
    }
}
exports.BasePlugin = BasePlugin;
