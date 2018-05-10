import { EventEmitter } from 'events';

import { BaseBotPlugin } from '../lib/base.bot-plugin';
import { IBot, IBotMessage } from '../lib/interfaces';
import { checkWordsInMessage, removeWordsFromMessage } from '../lib/utils';
import * as _ from 'lodash';
import { google } from 'googleapis';

const customsearch = google.customsearch('v1');

export class GoogleApisBotPlugin extends BaseBotPlugin {
    public name = 'google-apis';
    public description = 'Search word in sites over google custom search api';
    public whatCanIdo = {
        'en': 'I know how to look for information on the sites over google custom search api',
        'ru': 'Умею искать информацию на сайтах через поисковое апи google custom search'
    };
    protected wordsForSpy: string[];

    constructor(
        protected botLocale: string,
        protected botNameAliases: string[],
        protected apiKey: string,
        protected customSearchEngineId: string,
        protected searchQueryPrefix: string,
        protected searchSpyWords: string[],
        protected whatCanIdoEn?: string,
        protected whatCanIdoRu?: string
    ) {
        super(botLocale, botNameAliases);
        this.wordsForSpy = searchSpyWords;
        if (whatCanIdoRu !== undefined) {
            this.whatCanIdo['ru'] = whatCanIdoRu;
        }
        if (whatCanIdoEn !== undefined) {
            this.whatCanIdo['en'] = whatCanIdoEn;
        }
    }
    public check(bot: IBot, msg: IBotMessage): boolean {
        return msg.text &&
            (
                (
                    checkWordsInMessage(msg.text, this.wordsForSpy) &&
                    msg.chat.type === 'private'
                ) ||
                (
                    checkWordsInMessage(msg.text, this.botNameAliases) &&
                    checkWordsInMessage(msg.text, this.wordsForSpy) &&
                    msg.chat.type !== 'private'
                )
            );
    }
    protected search(text: string, msg?: IBotMessage, resultsCount?: number) {
        const event = new EventEmitter();
        const options: any = {
            cx: this.customSearchEngineId,
            q: encodeURIComponent(text),
            auth: this.apiKey,
            lr: `lang_${this.getLocaleCode(msg)}`,
            num: resultsCount ? resultsCount : 10
        };
        try {
            customsearch.cse.list(options, (error: any, resp: any) => {
                if (error) {
                    if (error.errors && error.errors[0] && error.errors[0].message) {
                        event.emit('message', 'Error: ' + error.errors[0].reason, error.errors[0].message, '');
                    }
                    event.emit('customError', `Error\n${JSON.stringify(error)}`);
                } else {
                    if (resp.data.items && resp.data.items.length > 0) {
                        const index: number = _.random(Math.min(options.num, resp.data.items.length));
                        const item = resp.data.items[index];
                        if (item) {
                            event.emit('message', item.title, item.snippet, item.link);
                        } else {
                            event.emit('message', false, false, false);
                        }
                    } else {
                        event.emit('message', false, false, false);
                    }
                }
            });
        } catch (error) {
            event.emit('customError', `Error\n${JSON.stringify(error)}`);
        }
        return event;
    }
    public process(bot: IBot, msg: IBotMessage): EventEmitter {
        const event = new EventEmitter();
        if (msg.text) {
            let text = removeWordsFromMessage(msg.text, this.wordsForSpy);
            text = removeWordsFromMessage(text, this.botNameAliases);
            this.search(text, msg)
                .on('message', (title: string, snippet: string, link: string) => {
                    if (title) {
                        const message =
                            title + '\n`' +
                            snippet +
                            '`\n' +
                            `${link}`;
                        event.emit('message', message);
                    } else {
                        event.emit('message', false);
                    }
                })
                .on('customError', (message: string) =>
                    event.emit('customError', message)
                );
        }
        return event;
    }
}
