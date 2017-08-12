import { EventEmitter } from 'events';
import * as _ from 'lodash';
import { checkWordsInMessage, removeWordsFromMessage } from '../lib/utils';
import { IBot, IBotPlugin, IBotMessage } from '../lib/interfaces';

const wikijs = require('wikijs');
const wtfWikipedia = require('wtf_wikipedia');

export class WikIBotPlugin implements IBotPlugin {
    public name = 'wiki';
    public description = 'Get basic information of word from wikipedia';
    protected wordsForSpy: string[];

    constructor(
        protected telegramBotLocale: string,
        protected telegramBotNameAliases: string[],
        protected wikipediaContentLength: number,
        protected wikipediaSpyWords: string[]
    ) {
        this.wordsForSpy = wikipediaSpyWords;
    }
    public check(bot: IBot, msg: IBotMessage): boolean {
        return (
            checkWordsInMessage(msg.text, this.wordsForSpy) &&
            msg.chat.type === 'private'
        ) ||
            (
                checkWordsInMessage(msg.text, this.telegramBotNameAliases) &&
                checkWordsInMessage(msg.text, this.wordsForSpy) &&
                msg.chat.type !== 'private'
            );
    }
    protected searchOnWiki(text: string, locale?: string) {
        const event = new EventEmitter();
        locale = locale === undefined ? this.telegramBotLocale : locale;
        wikijs.default({ apiUrl: `http://${locale}.wikipedia.org/w/api.php` })
            .search(text, 1).then((data: any) => {
                if (data.results.length > 0) {
                    let pageName = data.results[0];
                    pageName = pageName.replace(new RegExp(' ', 'ig'), '_');
                    wtfWikipedia.from_api(pageName, this.telegramBotLocale, (markup: any) => {
                        let answer = '';
                        if (markup) {
                            const parsedMarkup = wtfWikipedia.parse(markup) || null;
                            if (parsedMarkup.pages && parsedMarkup.pages.length > 0) {
                                const arr = markup.split('\n');
                                if (arr.length > 0) {
                                    answer = parsedMarkup.pages.join('\n\n');
                                } else {
                                    answer = '';
                                }
                            } else {
                                answer = wtfWikipedia.plaintext(markup).replace(new RegExp('\n\n', 'ig'), '\n');
                            }
                        }
                        const url = `https://${locale}.wikipedia.org/wiki/${pageName}`;
                        event.emit('message', answer, url);
                    });
                } else {
                    event.emit('message', false, false);
                }
            }, (error: any) => {
                event.emit('message', false, false);
            });
        return event;
    }
    public process(bot: IBot, msg: IBotMessage): EventEmitter {
        const event = new EventEmitter();
        let text = removeWordsFromMessage(msg.text, this.wordsForSpy);
        text = removeWordsFromMessage(text, this.telegramBotNameAliases);
        this.searchOnWiki(text).on('message', (answer: string, url: string) => {
            if (!answer || !checkWordsInMessage(answer, _.words(text))) {
                this.searchOnWiki(text, 'en').on('message', (answerTwo: string, urlTwo: string) => {
                    if (answerTwo) {
                        event.emit('message', answerTwo.substring(0, this.wikipediaContentLength) + '...\n\n' + urlTwo);
                    } else {
                        if (urlTwo) {
                            event.emit('message', urlTwo);
                        } else {
                            event.emit('message', false);
                        }
                    }
                });
            } else {
                if (answer) {
                    event.emit('message', answer.substring(0, 1000) + '...\n\n' + url);
                } else {
                    if (url) {
                        event.emit('message', url);
                    } else {
                        event.emit('message', false);
                    }
                }
            }
        });
        return event;
    }
}
