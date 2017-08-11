/// <reference types="node-telegram-bot-api" />
/// <reference types="node" />
import TelegramBot = require('node-telegram-bot-api');
import { EventEmitter } from 'events';
import { IPlugin, ITelegramBotMessage } from './base.plugin';
export declare class ScraperPlugin implements IPlugin {
    protected bot: TelegramBot;
    protected telegramBotNameAliases: string[];
    protected scraperUri: string;
    protected scraperTimeout: number;
    protected scraperContentSelector: string;
    protected scraperContentLength: number;
    protected scraperSpyWords: string[];
    name: string;
    description: string;
    protected wordsForSpy: string[];
    constructor(bot: TelegramBot, telegramBotNameAliases: string[], scraperUri: string, scraperTimeout: number, scraperContentSelector: string, scraperContentLength: number, scraperSpyWords: string[]);
    check(msg: ITelegramBotMessage): boolean;
    protected scrap(text: string): EventEmitter;
    process(msg: ITelegramBotMessage): EventEmitter;
}
