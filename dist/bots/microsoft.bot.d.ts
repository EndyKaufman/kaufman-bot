/// <reference types="node" />
import { IBot } from '../lib/interfaces';
import { EventEmitter } from 'events';
export declare class MicrosoftBot implements IBot {
    protected onEvent: EventEmitter;
    originalConnector: any;
    originalBot: any;
    constructor(appId: string, appPassword: string);
    processUpdate(update: any): boolean;
    sendMessage(chatId: number | string, text: string, options?: any): any;
    setWebHook(url: string, options?: any): any;
    on(event: string | symbol, listener: (...args: any[]) => void): any;
    emit(event: string | symbol, ...args: any[]): boolean;
}
