/// <reference types="node" />
import { EventEmitter } from 'events';
export interface ITelegramBotMessageChat {
    id: string;
    type: string;
}
export interface ITelegramBotMessage {
    text: string;
    chat: ITelegramBotMessageChat;
}
export interface IBasePlugin {
    name: string;
    description: string;
    check(msg: ITelegramBotMessage): boolean;
    process(msg: ITelegramBotMessage): EventEmitter;
}
