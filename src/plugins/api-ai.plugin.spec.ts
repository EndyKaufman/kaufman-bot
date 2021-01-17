import * as chai from 'chai';
import { config } from 'dotenv';
import { IBotMessage } from '../lib/interfaces';
import { ApiAiBotPlugin } from './api-ai.plugin';

const assert = chai.assert;

describe('ApiAiBotPlugin', () => {
  describe('without bot', () => {
    let plugin: ApiAiBotPlugin;
    before(() => {
      config();
      plugin = new ApiAiBotPlugin('en', ['bot'], process.env.APIAI_CLIENT_ACCESS_TOKEN);
    });
    it('should response a message "hi bro!"', (done) => {
      const msg: IBotMessage = {
        text: 'hi',
        chat: {
          id: 'random',
          type: 'private',
        },
      };
      plugin.process(null, msg).on('message', (answer: string) => {
        assert(answer === 'hi bro!', answer);
        done();
      });
    });
  });
});
