"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const _ = require("lodash");
const utils_1 = require("../lib/utils");
const wikijs = require('wikijs');
const wtfWikipedia = require("wtf_wikipedia");
class WikiPlugin {
    constructor(bot, telegramBotLocale, telegramBotNameAliases, wikipediaContentLength, wikipediaSpyWords) {
        this.bot = bot;
        this.telegramBotLocale = telegramBotLocale;
        this.telegramBotNameAliases = telegramBotNameAliases;
        this.wikipediaContentLength = wikipediaContentLength;
        this.wikipediaSpyWords = wikipediaSpyWords;
        this.name = 'wiki';
        this.description = 'Get basic information of word from wikipedia';
        this.wordsForSpy = wikipediaSpyWords;
    }
    check(msg) {
        return (utils_1.checkWordsInMessage(msg.text, this.wordsForSpy) &&
            msg.chat.type === 'private') ||
            (utils_1.checkWordsInMessage(msg.text, this.telegramBotNameAliases) &&
                utils_1.checkWordsInMessage(msg.text, this.wordsForSpy) &&
                msg.chat.type !== 'private');
    }
    searchOnWiki(text, locale) {
        const event = new events_1.EventEmitter();
        locale = locale === undefined ? this.telegramBotLocale : locale;
        wikijs.default({ apiUrl: `http://${locale}.wikipedia.org/w/api.php` })
            .search(text, 1).then((data) => {
            if (data.results.length > 0) {
                let pageName = data.results[0];
                pageName = pageName.replace(new RegExp(' ', "ig"), '_');
                wtfWikipedia.from_api(pageName, this.telegramBotLocale, (markup) => {
                    let answer = '';
                    if (markup) {
                        answer = wtfWikipedia.plaintext(markup).replace(new RegExp('\n\n', "ig"), '\n');
                    }
                    let url = `https://${locale}.wikipedia.org/wiki/${pageName}`;
                    event.emit('message', answer, url);
                });
            }
            else {
                event.emit('message', false, false);
            }
        }, (error) => event.emit('message', false, false));
        return event;
    }
    process(msg) {
        const event = new events_1.EventEmitter();
        let text = utils_1.removeWordsFromMessage(msg.text, this.wordsForSpy);
        text = utils_1.removeWordsFromMessage(text, this.telegramBotNameAliases);
        this.searchOnWiki(text).on('message', (answer, url) => {
            if (!answer || !utils_1.checkWordsInMessage(answer, _.words(text))) {
                this.searchOnWiki(text, 'en').on('message', (answer, url) => {
                    if (answer) {
                        event.emit('message', answer.substring(0, this.wikipediaContentLength) + '...\n\n' + url);
                    }
                    else {
                        if (url) {
                            event.emit('message', url);
                        }
                        else {
                            event.emit('message', false);
                        }
                    }
                });
            }
            else {
                if (answer) {
                    event.emit('message', answer.substring(0, 1000) + '...\n\n' + url);
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
exports.WikiPlugin = WikiPlugin;
