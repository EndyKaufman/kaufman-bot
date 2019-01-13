import * as chai from 'chai';
import * as sinon from 'sinon';
import { config } from 'dotenv';
import { IBotMessage } from '../lib/interfaces';
import { GoogleApisBotPlugin } from './google-apis.plugin';

const assert = chai.assert;

describe('GoogleApisBotPlugin', () => {
    describe('without bot', () => {
        let plugin: GoogleApisBotPlugin;
        before(function () {
            config();
            plugin = new GoogleApisBotPlugin(
                'en',
                ['bot'],
                process.env.GOOGLE_APIS_API_KEY,
                process.env.GOOGLE_APIS_HABR_CUSTOM_SEARCH_ENGINE_ID,
                '',
                ['habr']
            );
        });
        it('should response include a message "Angular" or error with text "dailyLimitExceeded"', (done) => {
            const msg: IBotMessage = {
                text: 'habr Angular',
                chat: {
                    id: 'random',
                    type: 'private'
                }
            };
            plugin.process(null, msg)
                .on('message', (answer: any) => {
                    assert(answer.indexOf('Angular') !== -1 || answer.indexOf('dailyLimitExceeded') !== -1, answer);
                    done();
                });
        });
    });
});
