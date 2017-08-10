"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_plugin_1 = require("./base.plugin");
const events_1 = require("events");
const _ = require("lodash");
const utils_1 = require("../utils");
class WikiPlugin extends base_plugin_1.BasePlugin {
    constructor(bot) {
        super(bot);
        this.name = 'wiki';
        this.description = 'Get basic information of word from wikipedia';
        this.wiki = require('wikijs');
        this.wtfWikipedia = require("wtf_wikipedia");
        this.htmlToText = require('html-to-text');
        this.botNames = process.env.TELEGRAM_BOT_NAME_ALIASES.split(',');
        this.wordsForSpy = process.env.WIKIPEDIA_SPY_WORDS.split(',');
    }
    check(msg) {
        let text = (msg.chat.type === 'private') ? utils_1.removeWordsFromMessage(msg.text, this.botNames) : msg.text;
        return utils_1.checkWordsInMessage(text, this.botNames) ||
            (utils_1.checkWordsInMessage(text, this.wordsForSpy) && msg.chat.type === 'private');
    }
    searchOnWiki(text, locale) {
        const event = new events_1.EventEmitter();
        locale = locale === undefined ? this.botLocale : locale;
        this.wiki.default({ apiUrl: `http://${locale}.wikipedia.org/w/api.php` })
            .search(text, 1).then((data) => {
            if (data.results.length > 0) {
                let pageName = data.results[0];
                pageName = pageName.replace(new RegExp(' ', "ig"), '_');
                this.wtfWikipedia.from_api(pageName, this.botLocale, (markup) => {
                    let text = this.wtfWikipedia.plaintext(markup).replace(new RegExp('\n\n', "ig"), '\n');
                    let url = `https://${locale}.wikipedia.org/wiki/${pageName}`;
                    event.emit('message', text, url);
                });
            }
            else {
                event.emit('message', false, false);
            }
        }, (error) => event.emit('message', false));
        return event;
    }
    process(msg) {
        const event = new events_1.EventEmitter();
        if (utils_1.checkWordsInMessage(msg.text, this.botNames) || msg.chat.type === 'private') {
            let text = utils_1.removeWordsFromMessage(msg.text, this.wordsForSpy);
            text = (msg.chat.type === 'private') ? utils_1.removeWordsFromMessage(text, this.botNames) : text;
            this.searchOnWiki(text).on('message', (answer, url) => {
                if (!answer || !utils_1.checkWordsInMessage(answer, _.words(text))) {
                    this.searchOnWiki(text, 'en').on('message', (answer, url) => {
                        if (answer) {
                            event.emit('message', answer.substring(0, 1000) + '...\n\n' + url);
                        }
                        else {
                            event.emit('message', url);
                        }
                    });
                }
                else {
                    if (answer) {
                        event.emit('message', answer.substring(0, 1000) + '...\n\n' + url);
                    }
                    else {
                        event.emit('message', url);
                    }
                }
            });
        }
        else {
            event.emit('message', false);
        }
        return event;
    }
}
exports.WikiPlugin = WikiPlugin;
