import * as chai from 'chai';
import * as sinon from 'sinon';
import { config } from 'dotenv';
import { ApiAiBotPlugin } from './api-ai.plugin';
import { IBotMessage } from '../lib/interfaces';

const assert = chai.assert;

describe('ApiAiBotPlugin', () => {
    describe('without bot', () => {
        let plugin: ApiAiBotPlugin;
        before(function () {
            config();
            plugin = new ApiAiBotPlugin(
                'en',
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
                assert(answer === 'hi bro!', answer);
                done();
            })
        });
    });
});
