/// <reference types="node" />
import { EventEmitter } from 'events';
export interface IWebServer {
    app: any;
}
export interface IBotServer {
    startPlugin(message: string, pluginName: string): any;
    startEndpoint(server: IWebServer): any;
}
export interface IBot extends EventEmitter {
    processUpdate(update: any): void;
    sendMessage(chatId: number | string, text: string, options?: any): Promise<any>;
    setWebHook(url: string, options?: any): Promise<any>;
}
export interface IBotMessageChat {
    id: string;
    type: string;
}
export interface IBotMessage {
    text: string;
    chat: IBotMessageChat;
}
export interface IBotPlugin {
    name: string;
    description: string;
    check(bot: IBot, msg: IBotMessage): boolean;
    process(bot: IBot, msg: IBotMessage): EventEmitter;
}
