/// <reference types="commander" />
import * as commander from 'commander';
export declare class App {
    protected program: commander.CommanderStatic;
    protected package: any;
    protected adminTelegramUserId: string;
    protected port: string;
    protected debug: boolean;
    protected rollbarPostServerItemAccessToken: string;
    constructor();
    env(name: string, defaultValue?: any): any;
    initialize(): void;
}
