/// <reference types="node" />
import { EventEmitter } from 'events';
export interface IWebServer {
    app: any;
}
export interface IBotServer {
    startPlugin(message: string, pluginName: string, locale: string): any;
    startEndpoint(server: IWebServer): any;
}
export interface IBot {
    processUpdate(update: any): void;
    sendMessage(chatId: number | string, text: string, options?: any): any;
    setWebHook(url: string, options?: any): any;
    on(event: string | symbol, listener: (...args: any[]) => void): any;
    emit(event: string | symbol, ...args: any[]): boolean;
}
export interface IBotMessageFrom {
    id?: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    language_code?: string;
}
export interface IBotMessageChat {
    id?: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    type: string;
}
export interface IBotMessage {
    message_id?: string;
    from?: IBotMessageFrom;
    chat: IBotMessageChat;
    date?: number;
    text: string;
    originalData?: any;
    provider?: string;
}
export interface IDictionary<TValue> {
    [id: string]: TValue;
}
export interface IBotPlugin {
    name: string;
    description: string;
    whatCanIdo: IDictionary<string>;
    check(bot: IBot, msg: IBotMessage): boolean;
    process(bot: IBot, msg: IBotMessage): EventEmitter;
    answerWhatCanIdo(bot: IBot, msg: IBotMessage): string;
}
