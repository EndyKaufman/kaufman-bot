import * as chai from 'chai';
import { config } from 'dotenv';
import { IBotMessage } from '../lib/interfaces';
import { WikiBotPlugin } from './wiki.plugin';

const assert = chai.assert;

describe('WikiBotPlugin', () => {
  describe('without bot', () => {
    let plugin: WikiBotPlugin;
    before(() => {
      config();
      plugin = new WikiBotPlugin('en', ['bot'], 100, ['wiki']);
    });
    it('should response include a message "Corporation" or "Microsoft"', (done) => {
      const msg: IBotMessage = {
        text: 'wiki microsoft',
        chat: {
          id: 'random',
          type: 'private',
        },
      };
      plugin.process(null, msg).on('message', (answer: string) => {
        assert(answer.indexOf('Corporation') !== -1 || answer.indexOf('Microsoft') !== -1, answer);
        done();
      });
    });
  });
});
