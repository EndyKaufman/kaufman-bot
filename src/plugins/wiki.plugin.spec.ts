import * as chai from 'chai';
import * as sinon from 'sinon';
import { config } from 'dotenv';
import { ITelegramBotMessage } from './base.plugin';
import { WikiPlugin } from './wiki.plugin';

const assert = chai.assert;

describe('WikiPlugin', () => {
    describe('without telegram', () => {
        let plugin: WikiPlugin;
        before(function () {
            config();
            plugin = new WikiPlugin(
                null,
                'en',
                ['bot'],
                100,
                ['wiki']
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
