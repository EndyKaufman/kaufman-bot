import TelegramBot = require('node-telegram-bot-api');
import { BasePlugin, ITelegramBotMessage } from './base.plugin';
import { EventEmitter } from 'events';
import * as _ from 'lodash';

export class WikiPlugin extends BasePlugin {
    public name = 'wiki';
    public description = 'Get basic information of word from wikipedia';
    public wordsForSpy: string[];
    private botNames: string[];
    private wiki = require('wikijs');
    private wtfWikipedia = require("wtf_wikipedia");
    private htmlToText = require('html-to-text');

    constructor(bot: TelegramBot) {
        super(bot);
        this.botNames = process.env.TELEGRAM_BOT_NAME_ALIASES.split(',');
        this.wordsForSpy = process.env.WIKIPEDIA_SPY_WORDS.split(',');
    }
    public process(msg: ITelegramBotMessage): EventEmitter {
        const event = new EventEmitter();
        if (this.checkWordsForSpyInMessage(msg.text, this.botNames) || msg.chat.type === 'private') {
            msg.text = this.removeWordsForSpyFromMessage(msg.text);
            msg.text = this.removeWordsForSpyFromMessage(msg.text, this.botNames).trim();
            this.wiki.default({ apiUrl: `http://${this.botLocale}.wikipedia.org/w/api.php` }).search(msg.text, 1).then((data: any) => {
                if (data.results.length > 0) {
                    let pageName = data.results[0];
                    pageName = pageName.replace(new RegExp(' ', "ig"), '_');
                    this.wtfWikipedia.from_api(pageName, this.botLocale, (markup: any) => {
                        const text = this.wtfWikipedia.plaintext(markup).substring(0, 1000)
                            + '...'
                            + '\n\n'
                            + `https://${this.botLocale}.wikipedia.org/wiki/${pageName}`;
                        event.emit('message', text);
                    });
                } else {
                    event.emit('message', false);
                }
            }, (error: any) => event.emit('message', false));
        } else {
            event.emit('message', false);
        }
        return event;
    }
}
