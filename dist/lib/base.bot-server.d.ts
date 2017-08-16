/// <reference types="node" />
import { EventEmitter } from 'events';
import { IBotPlugin, IBotMessage, IBotServer, IBot, IWebServer } from './interfaces';
export declare class BaseBotServer implements IBotServer {
    protected name: string;
    protected debug: boolean;
    protected bot: IBot;
    protected webServer: IWebServer;
    protected botToken: string;
    protected botHookUrl: string;
    protected plugins: IBotPlugin[];
    constructor(name?: string);
    protected readonly namePrefix: string;
    protected env(name: string, defaultValue?: any): any;
    startPlugin(message: string, pluginName: string, locale: string): EventEmitter;
    startEndpoint(server: IWebServer): void;
    protected readonly actionUrl: string;
    protected processHook(): void;
    protected processUpdate(): void;
    protected processMessages(): void;
    protected checkHardBotAnswers(msg: IBotMessage, answer: string): EventEmitter;
    protected notFound(msg: IBotMessage): EventEmitter;
}
