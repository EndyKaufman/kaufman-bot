import TelegramBot = require('node-telegram-bot-api');
import { EventEmitter } from 'events';
import { IPlugin, ITelegramBotMessage } from './base.plugin';
import { removeWordsFromMessage, checkWordsInMessage } from '../lib/utils';


const apiai = require('apiai');

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
    protected askAi(message: string, sessionId: string): EventEmitter {
        const event = new EventEmitter();
        const request = this.ai.textRequest(message, {
            sessionId: sessionId
        });
        request.on('response', function (response: any) {
            event.emit('message', response.result.fulfillment.speech);
        });
        request.end();
        return event;
    }
    public process(msg: ITelegramBotMessage): EventEmitter {
        const event = new EventEmitter();
        this.askAi(msg.text, msg.chat.id).on('message', (answer: string) => {
            if (answer) {
                event.emit('message', answer);
            } else {
                msg.text = removeWordsFromMessage(msg.text, this.wordsForSpy);
                this.askAi(msg.text, msg.chat.id).on('message', (answerTwo: string) => {
                    event.emit('message', answerTwo);
                })
            }
        });
        return event;
    }
}
