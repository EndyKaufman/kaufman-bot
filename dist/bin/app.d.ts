/// <reference types="commander" />
import * as commander from 'commander';
export declare class App {
    protected program: commander.CommanderStatic;
    protected package: any;
    constructor();
    initialize(): void;
}
