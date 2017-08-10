import TelegramBot = require('node-telegram-bot-api');
import { IBasePlugin, ITelegramBotMessage } from './base.plugin';
import { EventEmitter } from 'events';
import { removeWordsFromMessage, checkWordsInMessage } from '../utils';
import apiai = require('apiai');

export class ApiAiPlugin implements IBasePlugin {
    public name = 'api-ai';
    public description = 'Simple usage https://api.ai service with default agent';
    private wordsForSpy: string[];
    private ai: any;
    constructor(
        private bot: TelegramBot,
        private telegramBotNameAliases: string[],
        private apiaiClientAccessToken: string
    ) {
        this.wordsForSpy = telegramBotNameAliases;
        this.ai = apiai(apiaiClientAccessToken);
    }
    public check(msg: ITelegramBotMessage): boolean {
        return checkWordsInMessage(msg.text, this.wordsForSpy) || msg.chat.type === 'private';
    }
    private processOne(msg: ITelegramBotMessage): EventEmitter {
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
