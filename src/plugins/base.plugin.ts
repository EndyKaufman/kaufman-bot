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
    public description: string;
    public bot: TelegramBot;
    public wordsForSpy: string[];
    constructor(bot: TelegramBot) {
        this.bot = bot;
    }
    public checkWordsForSpyInMessage(message: string, words?: string[]): boolean {
        words = words === undefined ? this.wordsForSpy : words;
        return words.filter(word =>
            message.toLowerCase().indexOf(word.toLowerCase()) !== -1
        ).length > 0;
    }
    public removeWordsForSpyFromMessage(message: string, words?: string[]): string {
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
