import * as chai from 'chai';
import * as sinon from 'sinon';
import { config } from 'dotenv';
import { ITelegramBotMessage } from './base.plugin';
import { ScraperPlugin } from './scraper.plugin';

const assert = chai.assert;
let plugin: ScraperPlugin;

describe('ScraperPlugin', () => {
    describe('without telegram', () => {
        before(function () {
            config();
            plugin = new ScraperPlugin(
                null,
                process.env.TELEGRAM_BOT_NAME_ALIASES.split(','),
                process.env.SCRAPER_PING_URI,
                +process.env.SCRAPER_PING_TIMEOUT,
                process.env.SCRAPER_PING_CONTENT_SELECTOR,
                +process.env.SCRAPER_PING_CONTENT_LENGTH,
                process.env.SCRAPER_PING_SPY_WORDS.split(',')
            );
        });
        it('should response include a message "--- ya.ru ping statistics ---"', (done) => {
            const msg: ITelegramBotMessage = {
                text: 'ping ya.ru',
                chat: {
                    id: 'random',
                    type: 'private'
                }
            };
            plugin.process(msg).on('message', (answer: string) => {
                assert(answer.indexOf('--- ya.ru ping statistics ---') !== -1);
                done();
            })
        });
    });
});
