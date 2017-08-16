import { EventEmitter } from 'events';
import * as _ from 'lodash';
import { checkWordsInMessage, removeWordsFromMessage } from '../lib/utils';
import { IBotPlugin, IBot, IBotMessage } from '../lib/interfaces';

const request = require('request');
const cheerio = require('cheerio');
const htmlToText = require('html-to-text');
const jschardet = require('jschardet');
const encoding = require('encoding');
const charset = require('charset');

export class ScraperPlugin implements IBotPlugin {
    public name = 'scraper';
    public description = 'Scraping content segment as jquery selector from remote site';
    public whatCanIdo = {
        'en': 'I know how to parse a page of sites and show a certain area',
        'ru': 'Умею парсить страницу сайтов и показывать определенный участок'
    };
    protected wordsForSpy: string[];

    constructor(
        protected botNameAliases: string[],
        protected scraperUri: string,
        protected scraperTimeout: number,
        protected scraperContentSelector: string,
        protected scraperContentLength: number,
        protected scraperSpyWords: string[],
        protected whatCanIdoEn?: string,
        protected whatCanIdoRu?: string
    ) {
        this.wordsForSpy = scraperSpyWords;
        if (whatCanIdoRu !== undefined) {
            this.whatCanIdo['ru'] = whatCanIdoRu;
        }
        if (whatCanIdoEn !== undefined) {
            this.whatCanIdo['en'] = whatCanIdoEn;
        }
    }
    public check(bot: IBot, msg: IBotMessage): boolean {
        return (
            checkWordsInMessage(msg.text, this.wordsForSpy) &&
            msg.chat.type === 'private'
        ) ||
            (
                checkWordsInMessage(msg.text, this.botNameAliases) &&
                checkWordsInMessage(msg.text, this.wordsForSpy) &&
                msg.chat.type !== 'private'
            );
    }
    public answerWhatCanIdo(bot: IBot, msg: IBotMessage): string {
        if (msg.from.language_code.toLowerCase().indexOf('ru') !== -1) {
            return this.whatCanIdo['ru'];
        }
        return this.whatCanIdo['en'];
    }
    protected scrap(text: string) {
        const event = new EventEmitter();
        const url = this.scraperUri.replace(new RegExp('{text}', 'ig'), encodeURIComponent(text.trim()));
        request.get(url, { timeout: this.scraperTimeout, encoding: 'binary' }, (error: any, response: any, body: any) => {
            if (error) {
                event.emit('message', false, false);
            } else {
                const $ = cheerio.load(body);
                let content = this.scraperContentSelector.split(',').map((selector: string) =>
                    htmlToText.fromString($(selector).html())
                ).join('\n\n');
                const enc = charset(response.headers, body) || jschardet.detect(body).encoding.toLowerCase();
                if (enc !== 'utf8') {
                    content = encoding.convert(new Buffer(content, 'binary'), 'utf8', enc).toString('utf8');
                }
                event.emit('message', content, url);
            }
        });
        return event;
    }
    public process(bot: IBot, msg: IBotMessage): EventEmitter {
        const event = new EventEmitter();
        let text = removeWordsFromMessage(msg.text, this.wordsForSpy);
        text = removeWordsFromMessage(text, this.botNameAliases);
        this.scrap(text).on('message', (answer: string, url: string) => {
            if (answer) {
                event.emit('message',
                    '`' + answer.substring(0, this.scraperContentLength)
                    + (answer.length > this.scraperContentLength ? '...' : '')
                    + '`\n\n'
                    + url);
            } else {
                event.emit('message', false);
            }
        });
        return event;
    }
}
