/// <reference types="node" />
import { BaseBotServer } from '../lib/base.bot-server';
import { IBot } from '../lib/interfaces';
import { EventEmitter } from 'events';
export declare class MicrosoftBot implements IBot {
    protected event: EventEmitter;
    protected originalConnector: any;
    protected originalBot: any;
    constructor(appId: string, appPassword: string);
    processUpdate(update: any): void;
    sendMessage(chatId: number | string, text: string, options?: any): Promise<any>;
    setWebHook(url: string, options?: any): Promise<any>;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    emit(event: string | symbol, ...args: any[]): boolean;
}
export declare class MicrosoftBotServer extends BaseBotServer {
    protected name: string;
    protected botPassword: string;
    constructor(name?: string);
}
