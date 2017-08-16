"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const builder = require("botbuilder");
class MicrosoftBot {
    constructor(appId, appPassword) {
        this.onEvent = new events_1.EventEmitter();
        this.onSendMessage = new events_1.EventEmitter();
        this.originalConnector = new builder.ChatConnector({
            appId: appId,
            appPassword: appPassword
        });
        this.originalBot = new builder.UniversalBot(this.originalConnector, (session) => {
            const msg = {
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
            this.onSendMessage.on('message', (chatId, text, options) => {
                if (chatId === session.message.address.id) {
                    session.send(text);
                }
            });
            this.onEvent.emit('message', msg);
        });
    }
    processUpdate(update) {
        return true;
    }
    sendMessage(chatId, text, options) {
        text = text.replace(new RegExp('\n', 'ig'), '\n\n');
        setTimeout(() => this.onSendMessage.emit('message', chatId, text, options), 500);
        return true;
    }
    setWebHook(url, options) {
        return true;
    }
    on(event, listener) {
        return this.onEvent.on(event, listener);
    }
    emit(event, ...args) {
        return this.onEvent.emit(event, ...args);
    }
}
exports.MicrosoftBot = MicrosoftBot;
