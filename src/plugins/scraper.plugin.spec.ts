import * as chai from 'chai';
import * as sinon from 'sinon';
import { config } from 'dotenv';
import * as express from 'express';
import { ScraperPlugin } from './scraper.plugin';
import { IBotMessage } from '../lib/interfaces';

const assert = chai.assert;

describe('ScraperPlugin', () => {
    const app = express();
    const server = app.listen(0);
    const port = server.address().port;

    describe('without telegram', () => {
        let plugin: ScraperPlugin;
        before(function () {
            config();
            plugin = new ScraperPlugin(
                ['bot'],
                `http://localhost:${port}/{text}`,
                1500,
                'title',
                100,
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
