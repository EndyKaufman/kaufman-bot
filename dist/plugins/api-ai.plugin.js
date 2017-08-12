"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const utils_1 = require("../lib/utils");
const apiai = require('apiai');
class ApiAIBotPlugin {
    constructor(botNameAliases, apiaiClientAccessToken) {
        this.botNameAliases = botNameAliases;
        this.apiaiClientAccessToken = apiaiClientAccessToken;
        this.name = 'api-ai';
        this.description = 'Simple usage https://api.ai service with default agent';
        this.wordsForSpy = botNameAliases;
        this.ai = apiai(apiaiClientAccessToken);
    }
    check(bot, msg) {
        return utils_1.checkWordsInMessage(msg.text, this.wordsForSpy) || msg.chat.type === 'private';
    }
    askAi(message, sessionId) {
        const event = new events_1.EventEmitter();
        const request = this.ai.textRequest(message, {
            sessionId: sessionId
        });
        request.on('response', function (response) {
            event.emit('message', response.result.fulfillment.speech);
        });
        request.end();
        return event;
    }
    process(bot, msg) {
        const event = new events_1.EventEmitter();
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
        return event;
    }
}
exports.ApiAIBotPlugin = ApiAIBotPlugin;
