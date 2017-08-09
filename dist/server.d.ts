/// <reference types="node-telegram-bot-api" />
/// <reference types="node" />
import { IBasePlugin } from './plugins/base.plugin';
import { EventEmitter } from 'events';
import TelegramBot = require('node-telegram-bot-api');
export declare class Server {
    app: any;
    bot: TelegramBot;
    botToken: string;
    plugins: IBasePlugin[];
    constructor();
    startPlugin(message: string, pluginName: string): EventEmitter;
    start(): void;
}
