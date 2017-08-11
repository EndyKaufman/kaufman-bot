import * as chai from 'chai';
import * as sinon from 'sinon';
import { config } from 'dotenv';
import { ITelegramBotMessage } from './base.plugin';
import { WikiPlugin } from './wiki.plugin';

const assert = chai.assert;
let plugin: WikiPlugin;

describe('WikiPlugin', () => {
    describe('without telegram', () => {
        before(function () {
            config();
            plugin = new WikiPlugin(
                null,
                process.env.TELEGRAM_BOT_LOCALE,
                process.env.TELEGRAM_BOT_NAME_ALIASES.split(','),
                +process.env.WIKIPEDIA_CONTENT_LENGTH,
                process.env.WIKIPEDIA_SPY_WORDS.split(',')
            );
        });
        it('should response include a message "Microsoft Corporation"', (done) => {
            const msg: ITelegramBotMessage = {
                text: 'wiki microsoft',
                chat: {
                    id: 'random',
                    type: 'private'
                }
            };
            plugin.process(msg).on('message', (answer: string) => {
                assert(answer.indexOf('Microsoft Corporation') !== -1);
                done();
            })
        });
    });
});
