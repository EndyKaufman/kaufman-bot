import { EventEmitter } from 'events';
import TelegramBot = require('node-telegram-bot-api');
import * as _ from 'lodash';

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
    checkWordsInMessage(message: string, words: string[]): boolean;
    removeWordsFromMessage(message: string, words: string[]): string;
    process(msg: ITelegramBotMessage): EventEmitter;
}
export class BasePlugin implements IBasePlugin {
    public name: string;
    public description: string;
    public bot: TelegramBot;
    public botLocale: string;
    public wordsForSpy: string[];
    constructor(bot: TelegramBot) {
        this.bot = bot;
        this.botLocale = process.env.TELEGRAM_BOT_LOCALE;
    }
    public checkWordsInMessage(message: string, words: string[]): boolean {
        words = words === undefined ? this.wordsForSpy : words;
        const messageWords = _.words((message ? message : '').toLowerCase());
        return words.filter(word =>
            messageWords.indexOf((word ? word : '').toLowerCase()) !== -1
        ).length > 0;
    }
    public removeWordsFromMessage(message: string, words: string[]): string {
        words = words === undefined ? this.wordsForSpy : words;
        words.map(word => message = message.replace(new RegExp(word, "ig"), ''))
        return message;
    }
    public process(msg: ITelegramBotMessage): EventEmitter {
        const event = new EventEmitter();
        setTimeout(item => event.emit('message', 'Hi!'), 700);
        return event;
    }
}
