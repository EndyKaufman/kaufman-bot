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
        for (let i = 0; i < this.plugins.length; i++) {
            if (
                !founded &&
                (pluginName === null && this.plugins[i].check(msg)) ||
                (pluginName !== null && this.plugins[i].name === pluginName)
            ) {
                founded = true;
                setTimeout(() =>
                    this.plugins[i].process(msg).on('message', (answer: string) => {
                        event.emit('message', answer);
                    }), 700);
            }
        }
        if (!founded) {
            setTimeout(() => event.emit('message', 'empty'), 700);
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
            for (let i = 0; i < this.plugins.length; i++) {
                if (!founded && this.plugins[i].check(msg)) {
                    founded = true;
                    setTimeout(item =>
                        this.plugins[i].process(msg).on('message', (answer: string) => {
                            if (answer) {
                                this.bot.sendMessage(msg.chat.id, answer);
                            }
                        }), 700);

                }
            }
        });
    }
}