import TelegramBot = require('node-telegram-bot-api');
import { BasePlugin, ITelegramBotMessage } from './base.plugin';
import { EventEmitter } from 'events';
import * as _ from 'lodash';
import { checkWordsInMessage, removeWordsFromMessage } from '../utils';

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
    public check(msg: ITelegramBotMessage): boolean {
        let text = (msg.chat.type === 'private') ? removeWordsFromMessage(msg.text, this.botNames) : msg.text;
        return checkWordsInMessage(text, this.botNames) ||
            (checkWordsInMessage(text, this.wordsForSpy) && msg.chat.type === 'private');
    }
    private searchOnWiki(text: string, locale?: string) {
        const event = new EventEmitter();
        locale = locale === undefined ? this.botLocale : locale;
        this.wiki.default({ apiUrl: `http://${locale}.wikipedia.org/w/api.php` })
            .search(text, 1).then((data: any) => {
                if (data.results.length > 0) {
                    let pageName = data.results[0];
                    pageName = pageName.replace(new RegExp(' ', "ig"), '_');
                    this.wtfWikipedia.from_api(pageName, this.botLocale, (markup: any) => {
                        let text = this.wtfWikipedia.plaintext(markup).replace(new RegExp('\n\n', "ig"), '\n');
                        let url = `https://${locale}.wikipedia.org/wiki/${pageName}`;
                        event.emit('message', text, url);
                    });
                } else {
                    event.emit('message', false, false);
                }
            }, (error: any) => event.emit('message', false));
        return event;
    }
    public process(msg: ITelegramBotMessage): EventEmitter {
        const event = new EventEmitter();
        if (checkWordsInMessage(msg.text, this.botNames) || msg.chat.type === 'private') {
            let text = removeWordsFromMessage(msg.text, this.wordsForSpy);
            text = (msg.chat.type === 'private') ? removeWordsFromMessage(text, this.botNames) : text;
            this.searchOnWiki(text).on('message', (answer: string, url: string) => {
                if (!answer || !checkWordsInMessage(answer, _.words(text))) {
                    this.searchOnWiki(text, 'en').on('message', (answer: string, url: string) => {
                        if (answer) {
                            event.emit('message', answer.substring(0, 1000) + '...\n\n' + url);
                        } else {
                            event.emit('message', url);
                        }
                    });
                } else {
                    if (answer) {
                        event.emit('message', answer.substring(0, 1000) + '...\n\n' + url);
                    } else {
                        event.emit('message', url);
                    }
                }
            });
        } else {
            event.emit('message', false);
        }
        return event;
    }
}
