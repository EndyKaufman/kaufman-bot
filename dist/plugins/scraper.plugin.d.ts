/// <reference types="node" />
import { EventEmitter } from 'events';
import { IBotPlugin, IBot, IBotMessage } from '../lib/interfaces';
export declare class ScraperPlugin implements IBotPlugin {
    protected botNameAliases: string[];
    protected scraperUri: string;
    protected scraperTimeout: number;
    protected scraperContentSelector: string;
    protected scraperContentLength: number;
    protected scraperSpyWords: string[];
    protected whatCanIdoEn: string;
    protected whatCanIdoRu: string;
    name: string;
    description: string;
    whatCanIdo: {
        'en': string;
        'ru': string;
    };
    protected wordsForSpy: string[];
    constructor(botNameAliases: string[], scraperUri: string, scraperTimeout: number, scraperContentSelector: string, scraperContentLength: number, scraperSpyWords: string[], whatCanIdoEn?: string, whatCanIdoRu?: string);
    check(bot: IBot, msg: IBotMessage): boolean;
    answerWhatCanIdo(bot: IBot, msg: IBotMessage): string;
    protected scrap(text: string): EventEmitter;
    process(bot: IBot, msg: IBotMessage): EventEmitter;
}
