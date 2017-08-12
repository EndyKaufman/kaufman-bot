/// <reference types="node" />
import { EventEmitter } from 'events';
import { IBotPlugin, IBotMessage, IBotServer, IBot, IWebServer } from './interfaces';
export declare class BaseBotServer implements IBotServer {
    protected name: string;
    protected bot: IBot;
    protected botToken: string;
    protected botHookUrl: string;
    protected plugins: IBotPlugin[];
    constructor(name?: string);
    protected readonly namePrefix: string;
    protected env(name: string, defaultValue?: any): any;
    startPlugin(message: string, pluginName: string): EventEmitter;
    startEndpoint(server: IWebServer): void;
    protected notFound(msg: IBotMessage): EventEmitter;
}