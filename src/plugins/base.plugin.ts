import { EventEmitter } from 'events';
import TelegramBot = require('node-telegram-bot-api');

export interface ITelegramBotMessageChat {
    id: string;
    type: string
}
export interface ITelegramBotMessage {
    text: string;
    chat: ITelegramBotMessageChat;
}
export interface IBasePlugin {
    name: string;
    wordsForSpy: string[];
    checkWordsForSpyInMessage(message: string): boolean;
    removeWordsForSpyFromMessage(message: string): string;
    process(msg: ITelegramBotMessage): EventEmitter;
}
export class BasePlugin implements IBasePlugin {
    public name: string;
    public bot: TelegramBot;
    public wordsForSpy: string[];
    constructor(bot: TelegramBot) {
        this.bot = bot;
    }
    public checkWordsForSpyInMessage(message: string): boolean {
        for (var i = 0; i < this.wordsForSpy.length; i++) {
            if (message.toLowerCase().indexOf(this.wordsForSpy[i].toLowerCase()) !== -1) {
                return true;
            }
        }
        return false;
    }
    public removeWordsForSpyFromMessage(message: string): string {
        for (var i = 0; i < this.wordsForSpy.length; i++) {
            message = message.replace(new RegExp(this.wordsForSpy[i], "ig"), '');
        }
        return message;
    }
    public process(msg: ITelegramBotMessage): EventEmitter {
        const event = new EventEmitter();
        setTimeout(_ => event.emit('message', 'Hi!'), 700);
        return event;
    }
}
