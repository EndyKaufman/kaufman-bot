"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_plugin_1 = require("./base.plugin");
const events_1 = require("events");
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
    process(msg) {
        const event = new events_1.EventEmitter();
        if (this.checkWordsForSpyInMessage(msg.text, this.botNames) || msg.chat.type === 'private') {
            msg.text = this.removeWordsForSpyFromMessage(msg.text);
            msg.text = this.removeWordsForSpyFromMessage(msg.text, this.botNames).trim();
            this.wiki.default({ apiUrl: `http://${this.botLocale}.wikipedia.org/w/api.php` }).search(msg.text, 1).then((data) => {
                if (data.results.length > 0) {
                    let pageName = data.results[0];
                    pageName = pageName.replace(new RegExp(' ', "ig"), '_');
                    this.wtfWikipedia.from_api(pageName, this.botLocale, (markup) => {
                        const text = this.wtfWikipedia.plaintext(markup).substring(0, 1000)
                            + '...'
                            + '\n\n'
                            + `https://${this.botLocale}.wikipedia.org/wiki/${pageName}`;
                        event.emit('message', text);
                    });
                }
                else {
                    event.emit('message', false);
                }
            }, (error) => event.emit('message', false));
        }
        else {
            event.emit('message', false);
        }
        return event;
    }
}
exports.WikiPlugin = WikiPlugin;
