/// <reference types="node" />
import { EventEmitter } from 'events';
import { IBot, IBotPlugin, IBotMessage } from '../lib/interfaces';
export declare class WikIBotPlugin implements IBotPlugin {
    protected botLocale: string;
    protected botNameAliases: string[];
    protected wikipediaContentLength: number;
    protected wikipediaSpyWords: string[];
    name: string;
    description: string;
    whatCanIdo: {
        'en': string;
        'ru': string;
    };
    protected wordsForSpy: string[];
    constructor(botLocale: string, botNameAliases: string[], wikipediaContentLength: number, wikipediaSpyWords: string[]);
    check(bot: IBot, msg: IBotMessage): boolean;
    answerWhatCanIdo(bot: IBot, msg: IBotMessage): string;
    protected searchOnWiki(text: string, locale?: string): EventEmitter;
    process(bot: IBot, msg: IBotMessage): EventEmitter;
}
