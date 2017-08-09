"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_plugin_1 = require("./base.plugin");
const events_1 = require("events");
const _ = require("lodash");
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
    searchOnWiki(text, locale) {
        const event = new events_1.EventEmitter();
        locale = locale === undefined ? this.botLocale : locale;
        this.wiki.default({ apiUrl: `http://${locale}.wikipedia.org/w/api.php` })
            .search(text, 1).then((data) => {
            if (data.results.length > 0) {
                let pageName = data.results[0];
                pageName = pageName.replace(new RegExp(' ', "ig"), '_');
                this.wtfWikipedia.from_api(pageName, this.botLocale, (markup) => {
                    let text = this.wtfWikipedia.plaintext(markup).substring(0, 1000)
                        + (markup ? '...\n\n' : '')
                        + `https://${locale}.wikipedia.org/wiki/${pageName}`;
                    event.emit('message', text);
                });
            }
            else {
                event.emit('message', false);
            }
        }, (error) => event.emit('message', false));
        return event;
    }
    process(msg) {
        const event = new events_1.EventEmitter();
        if (this.checkWordsInMessage(msg.text, this.botNames) || msg.chat.type === 'private') {
            let text = this.removeWordsFromMessage(msg.text, this.wordsForSpy);
            text = this.removeWordsFromMessage(text, this.botNames).trim();
            this.searchOnWiki(msg.text).on('message', (answer) => {
                if (!answer || this.checkWordsInMessage(answer, _.words(text))) {
                    this.searchOnWiki(text, 'en').on('message', (answer) => {
                        event.emit('message', answer);
                    });
                }
                else {
                    event.emit('message', answer);
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
