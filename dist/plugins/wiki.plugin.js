"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const _ = require("lodash");
const utils_1 = require("../lib/utils");
const wikijs = require('wikijs');
const wtfWikipedia = require('wtf_wikipedia');
class WikiBotPlugin {
    constructor(botLocale, botNameAliases, wikipediaContentLength, wikipediaSpyWords) {
        this.botLocale = botLocale;
        this.botNameAliases = botNameAliases;
        this.wikipediaContentLength = wikipediaContentLength;
        this.wikipediaSpyWords = wikipediaSpyWords;
        this.name = 'wiki';
        this.description = 'Get basic information of word from wikipedia';
        this.whatCanIdo = {
            'en': 'I know how to search for information on wikipedia, for example: `wiki micrososft`',
            'ru': 'Умею искать информацию в википедии, пример: `вики пушкин`'
        };
        this.wordsForSpy = wikipediaSpyWords;
    }
    check(bot, msg) {
        return (utils_1.checkWordsInMessage(msg.text, this.wordsForSpy) &&
            msg.chat.type === 'private') ||
            (utils_1.checkWordsInMessage(msg.text, this.botNameAliases) &&
                utils_1.checkWordsInMessage(msg.text, this.wordsForSpy) &&
                msg.chat.type !== 'private');
    }
    answerWhatCanIdo(bot, msg) {
        if (msg.from && msg.from.language_code && msg.from.language_code.toLowerCase().indexOf('ru') !== -1) {
            return this.whatCanIdo['ru'];
        }
        return this.whatCanIdo['en'];
    }
    searchOnWiki(text, locale) {
        const event = new events_1.EventEmitter();
        locale = locale === undefined ? this.botLocale : locale;
        wikijs.default({ apiUrl: `http://${locale}.wikipedia.org/w/api.php` })
            .search(text, 1).then((data) => {
            if (data.results.length > 0) {
                let pageName = data.results[0];
                pageName = pageName.replace(new RegExp(' ', 'ig'), '_');
                wtfWikipedia.from_api(pageName, this.botLocale, (markup) => {
                    let answer = '';
                    if (markup) {
                        const parsedMarkup = wtfWikipedia.parse(markup) || null;
                        if (parsedMarkup.pages && parsedMarkup.pages.length > 0) {
                            const arr = markup.split('\n');
                            if (arr.length > 0) {
                                answer = parsedMarkup.pages.join('\n\n');
                            }
                            else {
                                answer = '';
                            }
                        }
                        else {
                            answer = wtfWikipedia.plaintext(markup).replace(new RegExp('\n\n', 'ig'), '\n');
                        }
                    }
                    const url = `https://${locale}.wikipedia.org/wiki/${pageName}`;
                    event.emit('message', answer, url);
                });
            }
            else {
                event.emit('message', false, false);
            }
        }, (error) => {
            event.emit('message', false, false);
        });
        return event;
    }
    process(bot, msg) {
        const event = new events_1.EventEmitter();
        let text = utils_1.removeWordsFromMessage(msg.text, this.wordsForSpy);
        text = utils_1.removeWordsFromMessage(text, this.botNameAliases);
        this.searchOnWiki(text).on('message', (answer, url) => {
            if (!answer || !utils_1.checkWordsInMessage(answer, _.words(text))) {
                this.searchOnWiki(text, 'en').on('message', (answerTwo, urlTwo) => {
                    if (answerTwo) {
                        event.emit('message', '`' + answerTwo.substring(0, this.wikipediaContentLength)
                            + (answer.length > this.wikipediaContentLength ? '...' : '')
                            + '`\n\n'
                            + urlTwo);
                    }
                    else {
                        if (urlTwo) {
                            event.emit('message', urlTwo);
                        }
                        else {
                            event.emit('message', false);
                        }
                    }
                });
            }
            else {
                if (answer) {
                    event.emit('message', '`' + answer.substring(0, this.wikipediaContentLength)
                        + (answer.length > this.wikipediaContentLength ? '...' : '')
                        + '`\n\n'
                        + url);
                }
                else {
                    if (url) {
                        event.emit('message', url);
                    }
                    else {
                        event.emit('message', false);
                    }
                }
            }
        });
        return event;
    }
}
exports.WikiBotPlugin = WikiBotPlugin;
