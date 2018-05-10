import { EventEmitter } from 'events';
import * as _ from 'lodash';

import { BaseBotPlugin } from '../lib/base.bot-plugin';
import { IBot, IBotMessage } from '../lib/interfaces';
import { checkWordsInMessage, removeWordsFromMessage } from '../lib/utils';

const wikijs = require('wikijs');
const wtfWikipedia = require('wtf_wikipedia');

export class WikiBotPlugin extends BaseBotPlugin {
    public name = 'wiki';
    public description = 'Get basic information of word from wikipedia';
    public whatCanIdo = {
        'en': 'I know how to search for information on wikipedia, for example: `wiki micrososft`',
        'ru': 'Умею искать информацию в википедии, пример: `вики пушкин`'
    };
    protected wordsForSpy: string[];

    constructor(
        protected botLocale: string,
        protected botNameAliases: string[],
        protected wikipediaContentLength: number,
        protected wikipediaSpyWords: string[]
    ) {
        super(botLocale, botNameAliases);
        this.wordsForSpy = wikipediaSpyWords;
    }
    public check(bot: IBot, msg: IBotMessage): boolean {
        return msg.text && (
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
    protected searchOnWiki(text: string, locale: string) {
        const event = new EventEmitter();
        try {
            wikijs.default({ apiUrl: `http://${locale}.wikipedia.org/w/api.php` })
                .search(text, 1).then((data: any) => {
                    if (data.results.length > 0) {
                        let pageName = data.results[0];
                        pageName = pageName.replace(new RegExp(' ', 'ig'), '_');
                        wtfWikipedia.fetch(pageName, this.botLocale, (err: any, doc: any) => {
                            let answer = '';
                            if (doc) {
                                const markup = doc.markdown();
                                answer = markup.replace(new RegExp('\n\n', 'ig'), '\n');
                                answer = answer.replace(new RegExp('`', 'ig'), '');
                            }
                            const url = `https://${locale}.wikipedia.org/wiki/${pageName}`;
                            event.emit('message', answer, url);
                        });
                    } else {
                        event.emit('message', false, false);
                    }
                }, (error: any) => {
                    event.emit('message', false, false);
                    event.emit('customError', `Error\n${JSON.stringify(error)}`);
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
            this.searchOnWiki(text, this.getLocaleCode(msg))
                .on('message', (answer: string, url: string) => {
                    if (!answer || !checkWordsInMessage(answer, _.words(text))) {
                        this.searchOnWiki(text, 'en')
                            .on('message', (answerTwo: string, urlTwo: string) => {
                                if (answerTwo) {
                                    answerTwo = answerTwo.replace(new RegExp('«', 'ig'), '"').replace(new RegExp('»', 'ig'), '"');
                                    event.emit('message',
                                        '`' + answerTwo.substring(0, this.wikipediaContentLength)
                                        + (answer.length > this.wikipediaContentLength ? '...' : '')
                                        + '`\n\n'
                                        + `${urlTwo}`);
                                } else {
                                    if (urlTwo) {
                                        event.emit('message', `${urlTwo}`);
                                    } else {
                                        event.emit('message', false);
                                    }
                                }
                            })
                            .on('customError', (message: string) =>
                                event.emit('customError', message)
                            );
                    } else {
                        if (answer) {
                            answer = answer.replace(new RegExp('«', 'ig'), '"').replace(new RegExp('»', 'ig'), '"');
                            event.emit('message',
                                '`' + answer.substring(0, this.wikipediaContentLength)
                                + (answer.length > this.wikipediaContentLength ? '...' : '')
                                + '`\n\n'
                                + url);
                        } else {
                            if (url) {
                                event.emit('message', url);
                            } else {
                                event.emit('message', false);
                            }
                        }
                    }
                })
                .on('customError', (message: string) =>
                    event.emit('customError', message)
                );
        }
        return event;
    }
}
