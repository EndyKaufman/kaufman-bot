import { EventEmitter } from 'events';
import { IBot } from '../lib/interfaces';

import builder = require('botbuilder');

export class MicrosoftBot implements IBot {
  protected onEvent: EventEmitter;
  public originalConnector: builder.BotFrameworkAdapter;
  public originalBot: any;
  constructor(appId: string, appPassword: string) {
    this.onEvent = new EventEmitter();
    this.originalConnector = new builder.BotFrameworkAdapter({
      appId: appId,
      appPassword: appPassword,
    });
    /*
    this.originalBot = new builder.UniversalBot(
      this.originalConnector,
      (session: any) => {
        const msg: IBotMessage = {
          text: session.message.text,
          chat: {
            id: session.message.address.id,
            type: 'private'
          },
          from: {
            language_code: session.message.textLocale
          },
          originalData: session,
          provider: 'microsoft'
        };
        this.onEvent.emit('message', msg);
      }
    );*/
  }
  processUpdate(update: any) {
    return true;
  }
  sendMessage(chatId: number | string, text: string, options?: any): any {
    text = text.replace(new RegExp('\n', 'ig'), '\n\n');
    text = text.replace(new RegExp('`', 'ig'), '');
    text = text + '\n';
    if (options.originalMessage && options.originalMessage.originalData && options.originalMessage.originalData) {
      options.originalMessage.originalData.send({
        type: 'message',
        text: text,
        textFormat: 'markdown',
      });
    }
    return true;
  }
  setWebHook(url: string, options?: any): any {
    return true;
  }
  on(event: string | symbol, listener: (...args: any[]) => void): any {
    return this.onEvent.on(event, listener);
  }
  emit(event: string | symbol, ...args: any[]): boolean {
    return this.onEvent.emit(event, ...args);
  }
}
