/// <reference types="node-telegram-bot-api" />
/// <reference types="node" />
import { IServer } from './base.server';
import { EventEmitter } from 'events';
import TelegramBot = require('node-telegram-bot-api');
import { IPlugin } from '../plugins/base.plugin';
export interface IBot {
    startPlugin(message: string, pluginName: string): any;
    startEndpoint(server: IServer): any;
}
export declare class BaseBot implements IBot {
    protected name: string;
    protected bot: TelegramBot;
    protected botToken: string;
    protected botHookUrl: string;
    protected plugins: IPlugin[];
    constructor(name?: string);
    protected readonly namePrefix: string;
    startPlugin(message: string, pluginName: string): EventEmitter;
    startEndpoint(server: IServer): void;
}
