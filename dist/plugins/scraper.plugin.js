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
class ScraperBotPlugin {
    constructor(botNameAliases, scraperUri, scraperTimeout, scraperContentSelector, scraperContentLength, scraperContentCodepage, scraperSpyWords, whatCanIdoEn, whatCanIdoRu) {
        this.botNameAliases = botNameAliases;
        this.scraperUri = scraperUri;
        this.scraperTimeout = scraperTimeout;
        this.scraperContentSelector = scraperContentSelector;
        this.scraperContentLength = scraperContentLength;
        this.scraperContentCodepage = scraperContentCodepage;
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
        return msg.text &&
            ((utils_1.checkWordsInMessage(msg.text, this.wordsForSpy) &&
                msg.chat.type === 'private') ||
                (utils_1.checkWordsInMessage(msg.text, this.botNameAliases) &&
                    utils_1.checkWordsInMessage(msg.text, this.wordsForSpy) &&
                    msg.chat.type !== 'private'));
    }
    answerWhatCanIdo(bot, msg) {
        if (msg.from && msg.from.language_code && msg.from.language_code.toLowerCase().indexOf('ru') !== -1) {
            return this.whatCanIdo['ru'];
        }
        return this.whatCanIdo['en'];
    }
    scrap(text, msg) {
        const event = new events_1.EventEmitter();
        try {
            let url = this.scraperUri.replace(new RegExp('{text}', 'ig'), encodeURIComponent(text.trim()));
            if (msg) {
                let lang = 'en';
                if (msg.from.language_code.toLowerCase().indexOf('ru') !== -1) {
                    lang = 'ru';
                }
                url = url.replace(new RegExp('{lang}', 'ig'), lang);
            }
            const options = { timeout: this.scraperTimeout };
            if (!this.scraperContentCodepage) {
                options['encoding'] = 'binary';
            }
            request.get(url, options, (error, response, body) => {
                if (error) {
                    event.emit('message', false, false);
                }
                else {
                    const $ = cheerio.load(body);
                    let content = this.scraperContentSelector.split(',').map((selector) => htmlToText.fromString($(selector).html())).join('\n\n');
                    const enc = charset(response.headers, body) || jschardet.detect(body).encoding.toLowerCase();
                    if (enc !== 'utf8') {
                        content = encoding.convert(new Buffer(content, 'binary'), 'utf8', enc, true).toString('utf8');
                    }
                    content = content.replace(new RegExp('`', 'ig'), '');
                    event.emit('message', content, url);
                }
            });
        }
        catch (error) {
            event.emit('error', `Error ${error.name}: ${error.message}\n${error.stack}`);
        }
        return event;
    }
    process(bot, msg) {
        const event = new events_1.EventEmitter();
        if (msg.text) {
            let text = utils_1.removeWordsFromMessage(msg.text, this.wordsForSpy);
            text = utils_1.removeWordsFromMessage(text, this.botNameAliases);
            this.scrap(text, msg).on('message', (answer, url) => {
                if (answer) {
                    const message = '`' + answer.substring(0, this.scraperContentLength)
                        + (answer.length > this.scraperContentLength ? '...' : '')
                        + '`\n\n'
                        + ((url.toLowerCase().indexOf('api.') === -1 || url.toLowerCase().indexOf('/api') === -1) ? url : '');
                    event.emit('message', message);
                }
                else {
                    event.emit('message', false);
                }
            });
        }
        return event;
    }
}
exports.ScraperBotPlugin = ScraperBotPlugin;
