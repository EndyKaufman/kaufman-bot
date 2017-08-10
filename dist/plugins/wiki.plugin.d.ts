/// <reference types="node-telegram-bot-api" />
/// <reference types="node" />
import TelegramBot = require('node-telegram-bot-api');
import { EventEmitter } from 'events';
import { IPlugin, ITelegramBotMessage } from './base.plugin';
export declare class WikiPlugin implements IPlugin {
    protected bot: TelegramBot;
    protected telegramBotLocale: string;
    protected telegramBotNameAliases: string[];
    protected wikipediaContentLength: number;
    protected wikipediaSpyWords: string[];
    name: string;
    description: string;
    protected wordsForSpy: string[];
    constructor(bot: TelegramBot, telegramBotLocale: string, telegramBotNameAliases: string[], wikipediaContentLength: number, wikipediaSpyWords: string[]);
    check(msg: ITelegramBotMessage): boolean;
    protected searchOnWiki(text: string, locale?: string): EventEmitter;
    process(msg: ITelegramBotMessage): EventEmitter;
}
