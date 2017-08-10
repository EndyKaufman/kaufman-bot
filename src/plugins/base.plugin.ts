import { EventEmitter } from 'events';
import TelegramBot = require('node-telegram-bot-api');
import * as _ from 'lodash';
import { checkWordsInMessage } from '../utils';

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
    check(msg: ITelegramBotMessage): boolean;
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
    public check(msg: ITelegramBotMessage): boolean {
        return checkWordsInMessage(msg.text, this.wordsForSpy) || msg.chat.type === 'private';
    }
    public process(msg: ITelegramBotMessage): EventEmitter {
        const event = new EventEmitter();
        setTimeout(item => event.emit('message', 'Hi!'), 700);
        return event;
    }
}
