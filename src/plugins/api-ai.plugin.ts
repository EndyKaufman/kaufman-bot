import { EventEmitter } from 'events';
import { removeWordsFromMessage, checkWordsInMessage } from '../lib/utils';
import { IBotPlugin, IBotMessage, IBot } from '../lib/interfaces';


const apiai = require('apiai');

export class ApiAIBotPlugin implements IBotPlugin {
    public name = 'api-ai';
    public description = 'Simple usage https://api.ai service with default agent';
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
