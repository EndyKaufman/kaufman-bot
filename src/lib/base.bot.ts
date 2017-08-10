import { IServer } from './base.server';
import { setTimeout } from 'timers';
import { EventEmitter } from 'events';
import TelegramBot = require('node-telegram-bot-api');
import { IPlugin, ITelegramBotMessage } from '../plugins/base.plugin';

export interface IBot {
    startPlugin(message: string, pluginName: string): any;
    startEndpoint(server: IServer): any;
}

export class BaseBot implements IBot {
    protected bot: TelegramBot;
    protected botToken: string;
    protected botHookUrl: string;
    protected plugins: IPlugin[] = [];
    constructor(protected name?: string) {
    }
    protected get namePrefix() {
        return this.name === undefined ? '' : this.name.toUpperCase() + '_';
    }
    public startPlugin(message: string, pluginName: string) {
        const event = new EventEmitter();
        let msg: ITelegramBotMessage = {
            text: message,
            chat: {
                id: 'random',
                type: 'private'
            }
        };
        let founded = false;
        let i = 0, len = this.plugins.length;
        for (i = 0; i < len; i++) {
            if (
                !founded &&
                (pluginName === null && this.plugins[i].check(msg)) ||
                (pluginName !== null && this.plugins[i].name === pluginName)
            ) {
                founded = true;
                this.plugins[i].process(msg).on('message', (answer: string) => {
                    if (answer) {
                        event.emit('message', answer);
                    } else {
                        this.notFound(msg).on('message', (answer: string) => {
                            event.emit('message', answer);
                        })
                    }
                });
                break;
            }
        }
        if (!founded) {
            event.emit('message', 'bot.empty');
        }
        return event;
    }
    public startEndpoint(server: IServer) {
        server.app.post(`/bot${this.botToken}`, (req: any, res: any) => {
            this.bot.processUpdate(req.body);
            res.sendStatus(200);
        });
        if (this.botHookUrl) {
            this.bot.setWebHook(`${this.botHookUrl}/bot${this.botToken}`);
        }
        this.bot.on('message', (msg: ITelegramBotMessage) => {
            let founded = false;
            let i = 0, len = this.plugins.length;
            for (i = 0; i < len; i++) {
                if (!founded && this.plugins[i].check(msg)) {
                    founded = true;
                    setTimeout(() =>
                        this.plugins[i].process(msg).on('message', (answer: string) => {
                            if (answer) {
                                this.bot.sendMessage(msg.chat.id, answer);
                            } else {
                                this.notFound(msg).on('message', (answer: string) => {
                                    this.bot.sendMessage(msg.chat.id, answer);
                                });
                            }
                        })
                        , 700);
                    break;
                }
            }
        });
    }
    protected notFound(msg: ITelegramBotMessage) {
        const event = new EventEmitter();
        setTimeout(() => {
            let founded = false;
            let j = 0, len = this.plugins.length;
            for (j = 0; j < len; j++) {
                if (!founded && this.plugins[j]['name'] === 'api-ai') {
                    founded = true;
                    msg.text = 'bot.not_found';
                    this.plugins[j].process(msg).on('message', (answer: string) => {
                        event.emit('message', answer);
                    });
                    break;
                }
            }
            if (!founded) {
                event.emit('message', 'bot.empty');
            }
        }, 700);
        return event;
    }
}