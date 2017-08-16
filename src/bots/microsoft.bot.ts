import { IBot, IBotMessage } from '../lib/interfaces';
import { EventEmitter } from 'events';
import * as _ from 'lodash';

import builder = require('botbuilder');

export class MicrosoftBot implements IBot {
    protected debug = true;
    protected onEvent: EventEmitter;
    public originalConnector: any;
    public originalBot: any;
    constructor(appId: string, appPassword: string) {
        this.onEvent = new EventEmitter();
        this.originalConnector = new builder.ChatConnector({
            appId: appId,
            appPassword: appPassword
        });
        this.originalBot = new builder.UniversalBot(this.originalConnector, (session: any) => {
            const msg: IBotMessage = {
                text: session.message.text,
                chat: {
                    id: session.message.address.id,
                    type: 'private'
                },
                from: {
                    language_code: session.message.textLocale
                },
                originalData: session,
                provider: 'microsoft'
            };
            this.onEvent.emit('message', msg);
        });
    }
    processUpdate(update: any) {
        return true;
    }
    sendMessage(chatId: number | string, text: string, options?: any): any {
        text = text.replace(new RegExp('\n', 'ig'), ' ');
        text = text.replace(new RegExp('`', 'ig'), '```');
        text = 'Умею, шутить, и, рассказывать, анекдоты, пример, шутка, Умею, пинговать, сайты, пример, пинг, ya, ru, Умею, искать, информацию, в, википедии, пример, вики, пушкин, Умею, отвечать, на, простые, выпросы, пример, Как, дела';
        if (options.originalMessage && options.originalMessage.originalData && options.originalMessage.originalData) {
            options.originalMessage.originalData.send(text);
        }
        return true;
    }
    setWebHook(url: string, options?: any): any {
        return true;
    }
    on(event: string | symbol, listener: (...args: any[]) => void): any {
        return this.onEvent.on(event, listener);
    }
    emit(event: string | symbol, ...args: any[]): boolean {
        return this.onEvent.emit(event, ...args);
    }
}
