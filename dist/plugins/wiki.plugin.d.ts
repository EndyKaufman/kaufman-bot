/// <reference types="node-telegram-bot-api" />
/// <reference types="node" />
import TelegramBot = require('node-telegram-bot-api');
import { IBasePlugin, ITelegramBotMessage } from './base.plugin';
import { EventEmitter } from 'events';
export declare class WikiPlugin implements IBasePlugin {
    private bot;
    private telegramBotLocale;
    private telegramBotNameAliases;
    private wikipediaSpyWords;
    name: string;
    description: string;
    private wordsForSpy;
    private wiki;
    private wtfWikipedia;
    constructor(bot: TelegramBot, telegramBotLocale: string, telegramBotNameAliases: string[], wikipediaSpyWords: string[]);
    check(msg: ITelegramBotMessage): boolean;
    private searchOnWiki(text, locale?);
    process(msg: ITelegramBotMessage): EventEmitter;
}
