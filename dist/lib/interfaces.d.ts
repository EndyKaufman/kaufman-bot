/// <reference types="node" />
import { EventEmitter } from 'events';
export interface IWebServer {
    app: any;
}
export interface IBotServer {
    startPlugin(message: string, pluginName: string): any;
    startEndpoint(server: IWebServer): any;
}
export interface IBot {
    processUpdate(update: any): void;
    sendMessage(chatId: number | string, text: string, options?: any): any;
    setWebHook(url: string, options?: any): any;
    on(event: string | symbol, listener: (...args: any[]) => void): any;
    emit(event: string | symbol, ...args: any[]): boolean;
}
export interface IBotMessageChat {
    id: string;
    type: string;
}
export interface IBotMessage {
    text: string;
    chat: IBotMessageChat;
    originalData?: any;
    provider?: string;
}
export interface IBotPlugin {
    name: string;
    description: string;
    check(bot: IBot, msg: IBotMessage): boolean;
    process(bot: IBot, msg: IBotMessage): EventEmitter;
}
