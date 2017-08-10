/// <reference types="node-telegram-bot-api" />
/// <reference types="node" />
import TelegramBot = require('node-telegram-bot-api');
import { IBasePlugin, ITelegramBotMessage } from './base.plugin';
import { EventEmitter } from 'events';
export declare class ApiAiPlugin implements IBasePlugin {
    private bot;
    private telegramBotNameAliases;
    private apiaiClientAccessToken;
    name: string;
    description: string;
    private wordsForSpy;
    private ai;
    constructor(bot: TelegramBot, telegramBotNameAliases: string[], apiaiClientAccessToken: string);
    check(msg: ITelegramBotMessage): boolean;
    private processOne(msg);
    process(msg: ITelegramBotMessage): EventEmitter;
}
