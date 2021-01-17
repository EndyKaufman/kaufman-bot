import { EventEmitter } from 'events';
import _ = require('lodash');

import { IBot, IBotMessage, IBotPlugin } from '../lib/interfaces';
import { checkWordsInMessage } from '../lib/utils';

export class BaseBotPlugin implements IBotPlugin {

    public name = '';
    public description = '';
    public whatCanIdo: any = {
    };
    protected wordsForSpy: string[];
    protected ai: any;
    constructor(
        protected botLocale: string,
        protected botNameAliases: string[]
    ) {
    }
    public check(bot: IBot, msg: IBotMessage): boolean {
        return msg.text &&
            (
                checkWordsInMessage(msg.text, this.wordsForSpy) ||
                msg.chat.type === 'private'
            );
    }
    public answerWhatCanIdo(bot: IBot, msg: IBotMessage): string {
        return this.whatCanIdo[this.getLocaleCode(msg)];
    }
    protected getLocaleCode(msg: IBotMessage) {
        const locales = Object.keys(this.whatCanIdo);
        const detectedLocales = locales.filter(locale =>
            (msg.from && msg.from.language_code && msg.from.language_code.toLowerCase().indexOf(locale) !== -1)
        );
        if (_.isEmpty(detectedLocales)) {
            if (this.botLocale) {
                return this.botLocale;
            } else {
                return 'en';
            }
        }
        return detectedLocales[0];
    }
    public process(bot: IBot, msg: IBotMessage): EventEmitter {
        const event = new EventEmitter();
        setTimeout(() => event.emit('message', 'hi'));
        return event;
    }
}
