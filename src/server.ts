import { setTimeout } from 'timers';
import { IBasePlugin, ITelegramBotMessage } from './plugins/base.plugin';
import { EventEmitter } from 'events';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import TelegramBot = require('node-telegram-bot-api');
import apiai = require('apiai');
import { ApiAiPlugin } from './plugins/api-ai.plugin';
import { WikiPlugin } from './plugins/wiki.plugin';

export class Server {
    public app: any;
    public bot: TelegramBot;
    public botToken: string;
    public plugins: IBasePlugin[] = [];
    constructor() {
        this.app = express();
        this.botToken = process.env.TELEGRAM_TOKEN;
        this.bot = new TelegramBot(this.botToken, { polling: true });
        // Include plugins
        this.plugins.push(new WikiPlugin(this.bot));
        this.plugins.push(new ApiAiPlugin(this.bot));
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
    public start() {
        // Init server
        this.app.use(bodyParser.json());
        this.app.post(`/bot${this.botToken}`, (req: any, res: any) => {
            this.bot.processUpdate(req.body);
            res.sendStatus(200);
        });
        this.app.listen(process.env.PORT, () => {
            console.log(`Express server is listening on ${process.env.PORT}`);
        });
        // Init telegram bot
        if (process.env.TELEGRAM_HOOK_URL) {
            this.bot.setWebHook(`${process.env.TELEGRAM_HOOK_URL}/bot${this.botToken}`);
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
