/// <reference types="node-telegram-bot-api" />
/// <reference types="node" />
import TelegramBot = require('node-telegram-bot-api');
import { BasePlugin, ITelegramBotMessage } from './base.plugin';
import { EventEmitter } from 'events';
export declare class ApiAiPlugin extends BasePlugin {
    name: string;
    description: string;
    wordsForSpy: string[];
    private ai;
    constructor(bot: TelegramBot);
    check(msg: ITelegramBotMessage): boolean;
    private processOne(msg);
    process(msg: ITelegramBotMessage): EventEmitter;
}
