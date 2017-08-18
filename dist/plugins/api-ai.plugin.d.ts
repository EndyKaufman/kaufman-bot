/// <reference types="node" />
import { EventEmitter } from 'events';
import { IBotPlugin, IBotMessage, IBot } from '../lib/interfaces';
export declare class ApiAiBotPlugin implements IBotPlugin {
    protected botNameAliases: string[];
    protected apiaiClientAccessToken: string;
    name: string;
    description: string;
    whatCanIdo: {
        'en': string;
        'ru': string;
    };
    protected wordsForSpy: string[];
    protected ai: any;
    constructor(botNameAliases: string[], apiaiClientAccessToken: string);
    check(bot: IBot, msg: IBotMessage): boolean;
    answerWhatCanIdo(bot: IBot, msg: IBotMessage): string;
    protected askAi(message: string, sessionId: string): EventEmitter;
    process(bot: IBot, msg: IBotMessage): EventEmitter;
}
