import { EventEmitter } from 'events';
import * as _ from 'lodash';
import { checkWordsInMessage, removeWordsFromMessage } from '../lib/utils';
import { IBotPlugin, IBot, IBotMessage } from '../lib/interfaces';
import { BaseBotPlugin } from '../lib/base.bot-plugin';

const request = require('request');
const cheerio = require('cheerio');
const htmlToText = require('html-to-text');
const jschardet = require('jschardet');
const encoding = require('encoding');
const charset = require('charset');

export class ScraperBotPlugin extends BaseBotPlugin {
    public name = 'scraper';
    public description = 'Scraping content segment as jquery selector from remote site';
    public whatCanIdo = {
        'en': 'I know how to parse a page of sites and show a certain area',
        'ru': 'Умею парсить страницу сайтов и показывать определенный участок'
    };
    protected wordsForSpy: string[];

    constructor(
        protected botLocale: string,
        protected botNameAliases: string[],
        protected scraperUri: string,
        protected scraperTimeout: number,
        protected scraperContentSelector: string,
        protected scraperContentLength: number,
        protected scraperContentCodepage: string,
        protected scraperSpyWords: string[],
        protected whatCanIdoEn?: string,
        protected whatCanIdoRu?: string
    ) {
        super(botLocale, botNameAliases);
        this.wordsForSpy = scraperSpyWords;
        if (whatCanIdoRu !== undefined) {
            this.whatCanIdo['ru'] = whatCanIdoRu;
        }
        if (whatCanIdoEn !== undefined) {
            this.whatCanIdo['en'] = whatCanIdoEn;
        }
    }
    public check(bot: IBot, msg: IBotMessage): boolean {
        return msg.text &&
            (
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
    protected scrap(text: string, msg?: IBotMessage) {
        const event = new EventEmitter();
        try {
            let url = this.scraperUri.replace(new RegExp('{text}', 'ig'), encodeURIComponent(text.trim()));
            if (msg) {
                url = url.replace(new RegExp('{lang}', 'ig'), this.getLocaleCode(msg));
            }
            const options: any = { timeout: this.scraperTimeout };
            if (!this.scraperContentCodepage) {
                options['encoding'] = 'binary';
            }
            request.get(url, options, (error: any, response: any, body: any) => {
                if (error) {
                    event.emit('message', false, false);
                } else {
                    const $ = cheerio.load(body);
                    let content = this.scraperContentSelector.split(',').map((selector: string) =>
                        htmlToText.fromString($(selector).html())
                    ).join('\n\n');
                    const enc = charset(response.headers, body) || jschardet.detect(body).encoding.toLowerCase();
                    if (enc !== 'utf8') {
                        content = encoding.convert(new Buffer(content, 'binary'), 'utf8', enc, true).toString('utf8');
                    }
                    content = content.replace(new RegExp('`', 'ig'), '');
                    event.emit('message', content, url);
                }
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
            this.scrap(text, msg)
                .on('message', (answer: string, url: string) => {
                    if (answer) {
                        const message =
                            '`' + answer.substring(0, this.scraperContentLength)
                            + (answer.length > this.scraperContentLength ? '...' : '')
                            + '`\n\n'
                            + ((url.toLowerCase().indexOf('api.') === -1 || url.toLowerCase().indexOf('/api') === -1) ? url : '');
                        event.emit('message', message);
                    } else {
                        event.emit('message', false);
                    }
                })
                .on('customError', (message: string) =>
                    event.emit('customError', message)
                );
        }
        return event;
    }
}
