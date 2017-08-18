import { IWebServer } from './interfaces';
export declare class BaseWebServer implements IWebServer {
    protected name: string;
    app: any;
    rollbar: any;
    constructor(name?: string);
    protected readonly namePrefix: string;
    protected env(name: string, defaultValue?: any): any;
    start(port: string, rollbarPostServerItemAccessToken?: string): void;
}
