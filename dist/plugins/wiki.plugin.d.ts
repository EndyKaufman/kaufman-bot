/// <reference types="node-telegram-bot-api" />
/// <reference types="node" />
import TelegramBot = require('node-telegram-bot-api');
import { BasePlugin, ITelegramBotMessage } from './base.plugin';
import { EventEmitter } from 'events';
export declare class WikiPlugin extends BasePlugin {
    name: string;
    description: string;
    wordsForSpy: string[];
    private botNames;
    private wiki;
    private wtfWikipedia;
    private htmlToText;
    constructor(bot: TelegramBot);
    check(msg: ITelegramBotMessage): boolean;
    private searchOnWiki(text, locale?);
    process(msg: ITelegramBotMessage): EventEmitter;
}
