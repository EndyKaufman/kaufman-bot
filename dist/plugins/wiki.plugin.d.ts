/// <reference types="node-telegram-bot-api" />
/// <reference types="node" />
import TelegramBot = require('node-telegram-bot-api');
import { IPlugin, ITelegramBotMessage } from './base.plugin';
import { EventEmitter } from 'events';
export declare class WikiPlugin implements IPlugin {
    protected bot: TelegramBot;
    protected telegramBotLocale: string;
    protected telegramBotNameAliases: string[];
    protected wikipediaSpyWords: string[];
    name: string;
    description: string;
    protected wordsForSpy: string[];
    protected wiki: any;
    protected wtfWikipedia: any;
    constructor(bot: TelegramBot, telegramBotLocale: string, telegramBotNameAliases: string[], wikipediaSpyWords: string[]);
    check(msg: ITelegramBotMessage): boolean;
    protected searchOnWiki(text: string, locale?: string): EventEmitter;
    process(msg: ITelegramBotMessage): EventEmitter;
}
