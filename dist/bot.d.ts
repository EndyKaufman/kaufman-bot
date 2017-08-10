/// <reference types="node" />
import { Server } from './server';
import { EventEmitter } from 'events';
export declare class Bot {
    private name;
    private bot;
    private botToken;
    private botHookUrl;
    private plugins;
    constructor(name?: string);
    private readonly namePrefix;
    startPlugin(message: string, pluginName: string): EventEmitter;
    startEndpoint(server: Server): void;
}
