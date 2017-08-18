import * as chai from 'chai';
import * as sinon from 'sinon';
import { config } from 'dotenv';
import * as express from 'express';
import { ScraperBotPlugin } from './scraper.plugin';
import { IBotMessage } from '../lib/interfaces';

const assert = chai.assert;

describe('ScraperBotPlugin', () => {
    const app = express();
    const server = app.listen(0);
    const port = server.address().port;

    describe('without bot', () => {
        let plugin: ScraperBotPlugin;
        before(function () {
            config();
            plugin = new ScraperBotPlugin(
                ['bot'],
                `http://localhost:${port}/{text}`,
                1500,
                'title',
                100,
                null,
                ['ping']
            );
        });
        after(function () {
            server.close();
        });
        it('should response include a message "Hello, World!"', (done) => {
            const msg: IBotMessage = {
                text: 'action',
                chat: {
                    id: 'random',
                    type: 'private'
                },
                from: {
                    language_code: 'en'
                }
            };
            app.get('/action', function (req, res) {
                res.send('<title>Hello, World!<title>');
            });
            plugin.process(null, msg).on('message', (answer: string) => {
                assert(answer.indexOf('Hello, World!') !== -1);
                done();
            })
        });
    });
});
