import TelegramBot = require('node-telegram-bot-api');
import { IPlugin, ITelegramBotMessage } from './base.plugin';
import { EventEmitter } from 'events';
import { removeWordsFromMessage, checkWordsInMessage } from '../lib/utils';
import apiai = require('apiai');

export class ApiAiPlugin implements IPlugin {
    public name = 'api-ai';
    public description = 'Simple usage https://api.ai service with default agent';
    protected wordsForSpy: string[];
    protected ai: any;
    constructor(
        protected bot: TelegramBot,
        protected telegramBotNameAliases: string[],
        protected apiaiClientAccessToken: string
    ) {
        this.wordsForSpy = telegramBotNameAliases;
        this.ai = apiai(apiaiClientAccessToken);
    }
    public check(msg: ITelegramBotMessage): boolean {
        return checkWordsInMessage(msg.text, this.wordsForSpy) || msg.chat.type === 'private';
    }
    protected processOne(msg: ITelegramBotMessage): EventEmitter {
        const event = new EventEmitter();
        const request = this.ai.textRequest(msg.text, {
            sessionId: msg.chat.id
        });
        request.on('response', function (response: any) {
            event.emit('message', response.result.fulfillment.speech);
        });
        request.end();
        return event;
    }
    public process(msg: ITelegramBotMessage): EventEmitter {
        const event = new EventEmitter();
        this.processOne(msg).on('message', (answer: string) => {
            if (answer) {
                event.emit('message', answer);
            } else {
                msg.text = removeWordsFromMessage(msg.text, this.wordsForSpy);
                this.processOne(msg).on('message', (answer: string) => {
                    event.emit('message', answer);
                })
            }
        });
        return event;
    }
}
