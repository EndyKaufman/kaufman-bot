"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const utils_1 = require("../lib/utils");
const request = require('request');
const cheerio = require('cheerio');
const htmlToText = require('html-to-text');
const jschardet = require('jschardet');
const encoding = require('encoding');
const charset = require('charset');
class ScraperPlugin {
    constructor(botNameAliases, scraperUri, scraperTimeout, scraperContentSelector, scraperContentLength, scraperSpyWords, whatCanIdoEn, whatCanIdoRu) {
        this.botNameAliases = botNameAliases;
        this.scraperUri = scraperUri;
        this.scraperTimeout = scraperTimeout;
        this.scraperContentSelector = scraperContentSelector;
        this.scraperContentLength = scraperContentLength;
        this.scraperSpyWords = scraperSpyWords;
        this.whatCanIdoEn = whatCanIdoEn;
        this.whatCanIdoRu = whatCanIdoRu;
        this.name = 'scraper';
        this.description = 'Scraping content segment as jquery selector from remote site';
        this.whatCanIdo = {
            'en': 'I know how to parse a page of sites and show a certain area',
            'ru': 'Умею парсить страницу сайтов и показывать определенный участок'
        };
        this.wordsForSpy = scraperSpyWords;
        if (whatCanIdoRu !== undefined) {
            this.whatCanIdo['ru'] = whatCanIdoRu;
        }
        if (whatCanIdoEn !== undefined) {
            this.whatCanIdo['en'] = whatCanIdoEn;
        }
    }
    check(bot, msg) {
        return (utils_1.checkWordsInMessage(msg.text, this.wordsForSpy) &&
            msg.chat.type === 'private') ||
            (utils_1.checkWordsInMessage(msg.text, this.botNameAliases) &&
                utils_1.checkWordsInMessage(msg.text, this.wordsForSpy) &&
                msg.chat.type !== 'private');
    }
    answerWhatCanIdo(bot, msg) {
        if (msg.from.language_code.toLowerCase().indexOf('ru') !== -1) {
            return this.whatCanIdo['ru'];
        }
        return this.whatCanIdo['en'];
    }
    scrap(text) {
        const event = new events_1.EventEmitter();
        const url = this.scraperUri.replace(new RegExp('{text}', 'ig'), encodeURIComponent(text.trim()));
        request.get(url, { timeout: this.scraperTimeout, encoding: 'binary' }, (error, response, body) => {
            if (error) {
                event.emit('message', false, false);
            }
            else {
                const $ = cheerio.load(body);
                let content = this.scraperContentSelector.split(',').map((selector) => htmlToText.fromString($(selector).html())).join('\n\n');
                const enc = charset(response.headers, body) || jschardet.detect(body).encoding.toLowerCase();
                if (enc !== 'utf8') {
                    content = encoding.convert(new Buffer(content, 'binary'), 'utf8', enc).toString('utf8');
                }
                event.emit('message', content, url);
            }
        });
        return event;
    }
    process(bot, msg) {
        const event = new events_1.EventEmitter();
        let text = utils_1.removeWordsFromMessage(msg.text, this.wordsForSpy);
        text = utils_1.removeWordsFromMessage(text, this.botNameAliases);
        this.scrap(text).on('message', (answer, url) => {
            if (answer) {
                event.emit('message', '`' + answer.substring(0, this.scraperContentLength)
                    + (answer.length > this.scraperContentLength ? '...' : '')
                    + '`\n\n'
                    + url);
            }
            else {
                event.emit('message', false);
            }
        });
        return event;
    }
}
exports.ScraperPlugin = ScraperPlugin;
