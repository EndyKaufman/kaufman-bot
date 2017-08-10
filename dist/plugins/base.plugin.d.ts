/// <reference types="node" />
/// <reference types="node-telegram-bot-api" />
import { EventEmitter } from 'events';
import TelegramBot = require('node-telegram-bot-api');
export interface ITelegramBotMessageChat {
    id: string;
    type: string;
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
export declare class BasePlugin implements IBasePlugin {
    name: string;
    description: string;
    bot: TelegramBot;
    botLocale: string;
    wordsForSpy: string[];
    constructor(bot: TelegramBot);
    process(msg: ITelegramBotMessage): EventEmitter;
}
