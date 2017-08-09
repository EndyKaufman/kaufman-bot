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
    private searchOnWiki(text: string, locale?: string) {
        const event = new EventEmitter();
        locale = locale === undefined ? this.botLocale : locale;
        this.wiki.default({ apiUrl: `http://${locale}.wikipedia.org/w/api.php` })
            .search(text, 1).then((data: any) => {
                if (data.results.length > 0) {
                    let pageName = data.results[0];
                    pageName = pageName.replace(new RegExp(' ', "ig"), '_');
                    this.wtfWikipedia.from_api(pageName, this.botLocale, (markup: any) => {
                        let text = '';
                        if (markup) {
                            text = this.wtfWikipedia.plaintext(markup).substring(0, 1000)
                                + (markup ? '...\n\n' : '')
                                + `https://${locale}.wikipedia.org/wiki/${pageName}`;
                            event.emit('message', text);
                        } else {
                            this.wiki.default({ apiUrl: `http://${locale}.wikipedia.org/w/api.php` })
                                .page(pageName).then((page: any) => page.html()).then((markup: any) => {
                                    text = this.htmlToText.fromString(markup, {
                                        wordwrap: 130,
                                        format: {
                                            image: () => '',
                                            //lineBreak: () => '',
                                            //paragraph: () => '',
                                            anchor: () => '',
                                            //heading: () => '',
                                            table: () => '',
                                            orderedList: () => '',
                                            unorderedList: () => '',
                                            listItem: () => '',
                                            horizontalLine: () => ''
                                        }
                                    }).substring(0, 1000)
                                        + (markup ? '...\n\n' : '')
                                        + `https://${locale}.wikipedia.org/wiki/${pageName}`;
                                    event.emit('message', text);
                                });
                        }
                    });
                } else {
                    event.emit('message', false);
                }
            }, (error: any) => event.emit('message', false));
        return event;
    }
    public process(msg: ITelegramBotMessage): EventEmitter {
        const event = new EventEmitter();
        if (this.checkWordsInMessage(msg.text, this.botNames) || msg.chat.type === 'private') {
            let text = this.removeWordsFromMessage(msg.text, this.wordsForSpy);
            text = this.removeWordsFromMessage(text, this.botNames).trim();
            this.searchOnWiki(msg.text).on('message', (answer: string) => {
                if (!answer || this.checkWordsInMessage(answer, _.words(text))) {
                    this.searchOnWiki(text, 'en').on('message', (answer: string) => {
                        event.emit('message', answer);
                    });
                } else {
                    event.emit('message', answer);
                }
            });
        } else {
            event.emit('message', false);
        }
        return event;
    }
}
