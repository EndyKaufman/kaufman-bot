/// <reference types="node" />
import { EventEmitter } from 'events';
import { IBot, IBotPlugin, IBotMessage } from '../lib/interfaces';
export declare class WikIBotPlugin implements IBotPlugin {
    protected telegramBotLocale: string;
    protected telegramBotNameAliases: string[];
    protected wikipediaContentLength: number;
    protected wikipediaSpyWords: string[];
    name: string;
    description: string;
    protected wordsForSpy: string[];
    constructor(telegramBotLocale: string, telegramBotNameAliases: string[], wikipediaContentLength: number, wikipediaSpyWords: string[]);
    check(bot: IBot, msg: IBotMessage): boolean;
    protected searchOnWiki(text: string, locale?: string): EventEmitter;
    process(bot: IBot, msg: IBotMessage): EventEmitter;
}
