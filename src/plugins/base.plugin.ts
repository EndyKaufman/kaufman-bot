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
    public process(msg: ITelegramBotMessage): EventEmitter {
        const event = new EventEmitter();
        setTimeout(item => event.emit('message', 'Hi!'), 700);
        return event;
    }
}
