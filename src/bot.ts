import { Server } from './server';
import { setTimeout } from 'timers';
import { EventEmitter } from 'events';
import { IBasePlugin, ITelegramBotMessage } from './plugins/base.plugin';
import TelegramBot = require('node-telegram-bot-api');
import { ApiAiPlugin } from './plugins/api-ai.plugin';
import { WikiPlugin } from './plugins/wiki.plugin';

export class Bot {
    private bot: TelegramBot;
    private botToken: string;
    private botHookUrl: string;
    private plugins: IBasePlugin[] = [];
    constructor(private name?: string) {
        this.botToken = process.env[this.namePrefix + 'TELEGRAM_TOKEN'];
        this.botHookUrl = process.env[this.namePrefix + 'TELEGRAM_HOOK_URL'];
        this.bot = new TelegramBot(this.botToken, { polling: true });
        // Include plugins
        this.plugins.push(new WikiPlugin(
            this.bot,
            process.env[this.namePrefix + 'TELEGRAM_BOT_LOCALE'],
            process.env[this.namePrefix + 'TELEGRAM_BOT_NAME_ALIASES'].split(','),
            process.env[this.namePrefix + 'WIKIPEDIA_SPY_WORDS'].split(',')
        ));
        this.plugins.push(new ApiAiPlugin(
            this.bot,
            process.env[this.namePrefix + 'TELEGRAM_BOT_NAME_ALIASES'].split(','),
            process.env[this.namePrefix + 'APIAI_CLIENT_ACCESS_TOKEN']
        ));
    }
    private get namePrefix() {
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
    public startEndpoint(server: Server) {
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