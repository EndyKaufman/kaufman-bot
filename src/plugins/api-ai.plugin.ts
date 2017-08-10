import TelegramBot = require('node-telegram-bot-api');
import { BasePlugin, ITelegramBotMessage } from './base.plugin';
import { EventEmitter } from 'events';
import { removeWordsFromMessage, checkWordsInMessage } from '../utils';
import apiai = require('apiai');

export class ApiAiPlugin extends BasePlugin {
    public name = 'api-ai';
    public description = 'Simple usage https://api.ai service with default agent';
    public wordsForSpy: string[];
    private ai: any;
    constructor(bot: TelegramBot) {
        super(bot);
        this.wordsForSpy = process.env.TELEGRAM_BOT_NAME_ALIASES.split(',');
        this.ai = apiai(process.env.APIAI_CLIENT_ACCESS_TOKEN);
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
