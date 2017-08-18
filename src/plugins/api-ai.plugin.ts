import { EventEmitter } from 'events';
import { removeWordsFromMessage, checkWordsInMessage } from '../lib/utils';
import { IBotPlugin, IBotMessage, IBot } from '../lib/interfaces';


const apiai = require('apiai');

export class ApiAiBotPlugin implements IBotPlugin {
    public name = 'api-ai';
    public description = 'Simple usage https://api.ai service with default agent';
    public whatCanIdo = {
        'en': 'I am able to answer simple questions, an example: `How are you?`',
        'ru': 'Умею отвечать на простые вопросы, пример: `Как дела?`'
    };
    protected wordsForSpy: string[];
    protected ai: any;
    constructor(
        protected botNameAliases: string[],
        protected apiaiClientAccessToken: string
    ) {
        this.wordsForSpy = botNameAliases;
        this.ai = apiai(apiaiClientAccessToken);
    }
    public check(bot: IBot, msg: IBotMessage): boolean {
        return checkWordsInMessage(msg.text, this.wordsForSpy) || msg.chat.type === 'private';
    }
    public answerWhatCanIdo(bot: IBot, msg: IBotMessage): string {
        if (msg.from && msg.from.language_code && msg.from.language_code.toLowerCase().indexOf('ru') !== -1) {
            return this.whatCanIdo['ru'];
        }
        return this.whatCanIdo['en'];
    }
    protected askAi(message: string, sessionId: string): EventEmitter {
        const event = new EventEmitter();
        try {
            const request = this.ai.textRequest(message, {
                sessionId: sessionId
            });
            request.on('response', function (response: any) {
                event.emit('message', response.result.fulfillment.speech);
            });
            request.end();
        } catch (error) {
            event.emit('error', `Error ${error.name}: ${error.message}\n${error.stack}`);
        }
        return event;
    }
    public process(bot: IBot, msg: IBotMessage): EventEmitter {
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
