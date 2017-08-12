import * as chai from 'chai';
import * as sinon from 'sinon';
import { config } from 'dotenv';
import { ApiAIBotPlugin } from './api-ai.plugin';
import { IBotMessage } from '../lib/interfaces';

const assert = chai.assert;

describe('ApiAIBotPlugin', () => {
    describe('without bot', () => {
        let plugin: ApiAIBotPlugin;
        before(function () {
            config();
            plugin = new ApiAIBotPlugin(
                ['bot'],
                process.env.APIAI_CLIENT_ACCESS_TOKEN
            );
        });
        it('should response a message "hi bro!"', (done) => {
            const msg: IBotMessage = {
                text: 'hi',
                chat: {
                    id: 'random',
                    type: 'private'
                }
            };
            plugin.process(null, msg).on('message', (answer: string) => {
                assert(answer === 'hi bro!');
                done();
            })
        });
    });
});