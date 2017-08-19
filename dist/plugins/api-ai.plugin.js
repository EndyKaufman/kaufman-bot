"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const utils_1 = require("../lib/utils");
const apiai = require('apiai');
class ApiAiBotPlugin {
    constructor(botNameAliases, apiaiClientAccessToken) {
        this.botNameAliases = botNameAliases;
        this.apiaiClientAccessToken = apiaiClientAccessToken;
        this.name = 'api-ai';
        this.description = 'Simple usage https://api.ai service with default agent';
        this.whatCanIdo = {
            'en': 'I am able to answer simple questions, an example: `How are you?`',
            'ru': 'Умею отвечать на простые вопросы, пример: `Как дела?`'
        };
        this.wordsForSpy = botNameAliases;
        this.ai = apiai(apiaiClientAccessToken);
    }
    check(bot, msg) {
        return msg.text &&
            (utils_1.checkWordsInMessage(msg.text, this.wordsForSpy) ||
                msg.chat.type === 'private');
    }
    answerWhatCanIdo(bot, msg) {
        if (msg.from && msg.from.language_code && msg.from.language_code.toLowerCase().indexOf('ru') !== -1) {
            return this.whatCanIdo['ru'];
        }
        return this.whatCanIdo['en'];
    }
    askAi(message, sessionId) {
        const event = new events_1.EventEmitter();
        try {
            const request = this.ai.textRequest(message, {
                sessionId: sessionId
            });
            request.on('response', function (response) {
                event.emit('message', response.result.fulfillment.speech);
            });
            request.end();
        }
        catch (error) {
            event.emit('error', `Error ${error.name}: ${error.message}\n${error.stack}`);
        }
        return event;
    }
    process(bot, msg) {
        const event = new events_1.EventEmitter();
        if (msg.text) {
            this.askAi(msg.text, msg.chat.id).on('message', (answer) => {
                if (answer) {
                    event.emit('message', answer);
                }
                else {
                    msg.text = utils_1.removeWordsFromMessage(msg.text, this.wordsForSpy);
                    this.askAi(msg.text, msg.chat.id).on('message', (answerTwo) => {
                        event.emit('message', answerTwo);
                    });
                }
            });
        }
        return event;
    }
}
exports.ApiAiBotPlugin = ApiAiBotPlugin;
