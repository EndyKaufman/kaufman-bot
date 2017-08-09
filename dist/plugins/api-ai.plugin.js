"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_plugin_1 = require("./base.plugin");
const events_1 = require("events");
const apiai = require("apiai");
class ApiAiPlugin extends base_plugin_1.BasePlugin {
    constructor(bot) {
        super(bot);
        this.name = 'api-ai';
        this.description = 'Simple usage https://api.ai service with default agent';
        this.wordsForSpy = process.env.TELEGRAM_BOT_NAME_ALIASES.split(',');
        this.ai = apiai(process.env.APIAI_CLIENT_ACCESS_TOKEN);
    }
    processOne(msg) {
        const event = new events_1.EventEmitter();
        const request = this.ai.textRequest(msg.text, {
            sessionId: msg.chat.id
        });
        request.on('response', function (response) {
            event.emit('message', response.result.fulfillment.speech);
        });
        request.end();
        return event;
    }
    process(msg) {
        const event = new events_1.EventEmitter();
        this.processOne(msg).on('message', (answer) => {
            if (answer) {
                event.emit('message', answer);
            }
            else {
                msg.text = this.removeWordsForSpyFromMessage(msg.text);
                this.processOne(msg).on('message', (answer) => {
                    event.emit('message', answer);
                });
            }
        });
        return event;
    }
}
exports.ApiAiPlugin = ApiAiPlugin;
