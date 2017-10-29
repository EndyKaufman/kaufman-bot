import { EventEmitter } from 'events';

import { BaseBotPlugin } from '../lib/base.bot-plugin';
import { IBot, IBotMessage } from '../lib/interfaces';
import { removeWordsFromMessage } from '../lib/utils';


const apiai = require('apiai');

export class ApiAiBotPlugin extends BaseBotPlugin {
    public name = 'api-ai';
    public description = 'Simple usage https://api.ai service with default agent';
    public whatCanIdo = {
        'en': 'I am able to answer simple questions, an example: `How are you?`',
        'ru': 'Умею отвечать на простые вопросы, пример: `Как дела?`'
    };
    protected wordsForSpy: string[];
    protected ai: any = {
        'en': null,
        'ru': null
    }
    protected ai_ru: any;
    constructor(
        protected botLocale: string,
        protected botNameAliases: string[],
        protected apiaiClientAccessToken: string
    ) {
        super(botLocale, botNameAliases);
        this.wordsForSpy = botNameAliases;
        this.ai['en'] = apiai(apiaiClientAccessToken, { language: 'en' });
        this.ai['ru'] = apiai(apiaiClientAccessToken, { language: 'ru' });
    }
    protected askAi(message: string, sessionId: string, locale: string): EventEmitter {
        const event = new EventEmitter();
        try {
            const request = this.ai[locale].textRequest(message.substring(0, 255), {
                sessionId: sessionId,
                lang: locale
            });
            request.on('response', function (response: any) {
                event.emit('message', response.result.fulfillment.speech);
            });
            request.end();
        } catch (error) {
            event.emit('customError', `Error\n${JSON.stringify(error)}`);
        }
        return event;
    }
    public process(bot: IBot, msg: IBotMessage): EventEmitter {
        const event = new EventEmitter();
        if (msg.text) {
            this.askAi(msg.text, msg.chat.id, this.getLocaleCode(msg))
                .on('message', (answer: string) => {
                    if (answer) {
                        event.emit('message', answer);
                    } else {
                        msg.text = removeWordsFromMessage(msg.text, this.wordsForSpy);
                        this.askAi(msg.text, msg.chat.id, this.getLocaleCode(msg)).on('message', (answerTwo: string) => {
                            event.emit('message', answerTwo);
                        })
                    }
                })
                .on('customError', (message: string) =>
                    event.emit('customError', message)
                );
        }
        return event;
    }
}
