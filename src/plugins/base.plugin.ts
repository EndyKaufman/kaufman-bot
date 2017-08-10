import { EventEmitter } from 'events';
import TelegramBot = require('node-telegram-bot-api');
import * as _ from 'lodash';
import { checkWordsInMessage } from '../utils';

export interface ITelegramBotMessageChat {
    id: string;
    type: string
}
export interface ITelegramBotMessage {
    text: string;
    chat: ITelegramBotMessageChat;
}
export interface IBasePlugin {
    name: string;
    description: string;
    check(msg: ITelegramBotMessage): boolean;
    process(msg: ITelegramBotMessage): EventEmitter;
}
