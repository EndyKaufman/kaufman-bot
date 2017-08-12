import { EventEmitter } from 'events';
import * as _ from 'lodash';
import { checkWordsInMessage, removeWordsFromMessage } from '../lib/utils';
import { IBotPlugin, IBot, IBotMessage } from '../lib/interfaces';

const request = require('request');
const cheerio = require('cheerio');
const htmlToText = require('html-to-text');

export class ScraperPlugin implements IBotPlugin {
    public name = 'scraper';
    public description = 'Scraping content segment as jquery selector from remote site';
    protected wordsForSpy: string[];

    constructor(
        protected botNameAliases: string[],
        protected scraperUri: string,
        protected scraperTimeout: number,
        protected scraperContentSelector: string,
        protected scraperContentLength: number,
        protected scraperSpyWords: string[]
    ) {
        this.wordsForSpy = scraperSpyWords;
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
    protected scrap(text: string) {
        const event = new EventEmitter();
        const url = this.scraperUri.replace(new RegExp('{text}', 'ig'), encodeURIComponent(text.trim()));
        request.get(url, { timeout: this.scraperTimeout }, (error: any, response: any, body: any) => {
            if (error) {
                event.emit('message', false, false);
            } else {
                const $ = cheerio.load(body);
                const content = $(this.scraperContentSelector).html();
                event.emit('message', htmlToText.fromString(content), url);
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
                event.emit('message', answer.substring(0, this.scraperContentLength) + '...\n\n' + url);
            } else {
                event.emit('message', false);
            }
        });
        return event;
    }
}
