"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const builder = require("botbuilder");
class MicrosoftBot {
    constructor(appId, appPassword) {
        this.onEvent = new events_1.EventEmitter();
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
                originalData: session,
                provider: 'microsoft'
            };
            this.onEvent.emit('message', msg);
        });
    }
    processUpdate(update) {
        return true;
    }
    sendMessage(chatId, text, options) {
        text = text.replace(new RegExp('\n', 'ig'), ' ');
        text = text.replace(new RegExp('`', 'ig'), ' ');
        if (options.originalMessage && options.originalMessage.originalData && options.originalMessage.originalData) {
            options.originalMessage.originalData.send(text);
        }
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
