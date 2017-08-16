import { BaseBotServer } from '../lib/base.bot-server';
import { IWebServer } from '../lib/interfaces';
import { MicrosoftBot } from './microsoft.bot';
export declare class MicrosoftBotServer extends BaseBotServer {
    protected name: string;
    protected server: IWebServer;
    protected bot: MicrosoftBot;
    protected botPassword: string;
    protected processUpdate(): void;
    constructor(name?: string, server?: IWebServer);
    protected readonly actionUrl: string;
}
