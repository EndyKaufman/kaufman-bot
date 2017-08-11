import * as chai from 'chai';
import * as sinon from 'sinon';
import { config } from 'dotenv';
import { ApiAiPlugin } from './api-ai.plugin';
import { ITelegramBotMessage } from './base.plugin';

const assert = chai.assert;
let plugin: ApiAiPlugin;

describe('ApiAiPlugin', () => {
    describe('without telegram', () => {
        before(function () {
            config();
            plugin = new ApiAiPlugin(
                null,
                process.env.TELEGRAM_BOT_NAME_ALIASES.split(','),
                process.env.APIAI_CLIENT_ACCESS_TOKEN
            );
        });
        it('should response a message "hi bro!"', (done) => {
            const msg: ITelegramBotMessage = {
                text: 'hi',
                chat: {
                    id: 'random',
                    type: 'private'
                }
            };
            plugin.process(msg).on('message', (answer: string) => {
                assert(answer === 'hi bro!');
                done();
            })
        });
    });
});
