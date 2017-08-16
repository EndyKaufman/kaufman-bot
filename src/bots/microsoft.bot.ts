import { IBot, IBotMessage } from '../lib/interfaces';
import { EventEmitter } from 'events';

import builder = require('botbuilder');

export class MicrosoftBot implements IBot {
    protected onEvent: EventEmitter;
    protected onSendMessage: EventEmitter;
    public originalConnector: any;
    public originalBot: any;
    constructor(appId: string, appPassword: string) {
        this.onEvent = new EventEmitter();
        this.onSendMessage = new EventEmitter();
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
                originalData: session.message,
                provider: 'microsoft'
            };
            this.onSendMessage.on('message', (chatId: number | string, text: string, options?: any) => {
                if (chatId === session.message.address.id) {
                    session.send(text);
                }
            });
            this.onEvent.emit('message', msg);
        });
    }
    processUpdate(update: any) {
        return true;
    }
    sendMessage(chatId: number | string, text: string, options?: any): any {
        text = text.replace(new RegExp('\n', 'ig'), '\n\n');
        text = text.replace(new RegExp('`', 'ig'), '');
        this.onSendMessage.emit('message', chatId, text, options);
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
