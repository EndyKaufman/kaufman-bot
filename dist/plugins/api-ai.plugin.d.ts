/// <reference types="node-telegram-bot-api" />
/// <reference types="node" />
import TelegramBot = require('node-telegram-bot-api');
import { IPlugin, ITelegramBotMessage } from './base.plugin';
import { EventEmitter } from 'events';
export declare class ApiAiPlugin implements IPlugin {
    protected bot: TelegramBot;
    protected telegramBotNameAliases: string[];
    protected apiaiClientAccessToken: string;
    name: string;
    description: string;
    protected wordsForSpy: string[];
    protected ai: any;
    constructor(bot: TelegramBot, telegramBotNameAliases: string[], apiaiClientAccessToken: string);
    check(msg: ITelegramBotMessage): boolean;
    protected processOne(msg: ITelegramBotMessage): EventEmitter;
    process(msg: ITelegramBotMessage): EventEmitter;
}
