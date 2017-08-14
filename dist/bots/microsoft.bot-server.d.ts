/// <reference types="node" />
import { BaseBotServer } from '../lib/base.bot-server';
import { IBot } from '../lib/interfaces';
import { EventEmitter } from 'events';
import { IWebServer } from '../lib/interfaces';
export declare class MicrosoftBot implements IBot {
    protected onEvent: EventEmitter;
    protected onSendMessage: EventEmitter;
    originalConnector: any;
    originalBot: any;
    constructor(appId: string, appPassword: string);
    processUpdate(update: any): boolean;
    sendMessage(chatId: number | string, text: string, options?: any): any;
    setWebHook(url: string, options?: any): any;
    on(event: string | symbol, listener: (...args: any[]) => void): any;
    emit(event: string | symbol, ...args: any[]): boolean;
}
export declare class MicrosoftBotServer extends BaseBotServer {
    protected name: string;
    protected server: IWebServer;
    protected bot: MicrosoftBot;
    protected botPassword: string;
    protected processUpdate(): void;
    constructor(name?: string, server?: IWebServer);
    protected readonly actionUrl: string;
}
