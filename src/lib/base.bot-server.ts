import { setTimeout } from 'timers';
import { EventEmitter } from 'events';
import { IBotPlugin, IBotMessage, IBotServer, IBot, IWebServer } from './interfaces';

export class BaseBotServer implements IBotServer {
    protected bot: IBot;
    protected webServer: IWebServer
    protected botToken: string;
    protected botHookUrl: string;
    protected plugins: IBotPlugin[];
    constructor(protected name?: string) {
        if (this.plugins === undefined) {
            this.plugins = [];
        }
    }
    protected get namePrefix() {
        return !this.name ? '' : this.name.toUpperCase() + '_';
    }
    protected env(name: string, defaultValue: any = '') {
        if (process.env[this.namePrefix + name]) {
            return process.env[this.namePrefix + name]
        } else {
            return defaultValue;
        }
    }
    public startPlugin(message: string, pluginName: string) {
        const event = new EventEmitter();
        const msg: IBotMessage = {
            text: message,
            chat: {
                id: 'random',
                type: 'private'
            }
        };
        let founded = false;
        let i = 0;
        const len = this.plugins.length;
        for (i = 0; i < len; i++) {
            if (
                !founded &&
                (pluginName === null && this.plugins[i].check(this.bot, msg)) ||
                (pluginName !== null && this.plugins[i].name === pluginName)
            ) {
                founded = true;
                this.plugins[i].process(this.bot, msg).on('message', (answer: string) => {
                    if (answer) {
                        event.emit('message', answer);
                    } else {
                        this.notFound(msg).on('message', (notFoundAnswer: string) => {
                            event.emit('message', notFoundAnswer);
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
    public startEndpoint(server: IWebServer) {
        this.webServer = server;
        this.processUpdate();
        this.processHook();
        this.processMessages();
    }
    protected get actionUrl() {
        return `/bot${this.botToken}`;
    }
    protected processHook() {
        if (this.botHookUrl) {
            this.bot.setWebHook(this.botHookUrl + this.actionUrl);
        }
    }
    protected processUpdate() {
        this.webServer.app.post(this.actionUrl, (req: any, res: any) => {
            this.bot.processUpdate(req.body);
            res.sendStatus(200);
        });
    }
    protected processMessages() {
        this.bot.on('message', (msg: IBotMessage) => {
            let founded = false;
            let i = 0;
            const len = this.plugins.length;
            for (i = 0; i < len; i++) {
                if (!founded && this.plugins[i].check(this.bot, msg)) {
                    founded = true;
                    setTimeout(() =>
                        this.plugins[i].process(this.bot, msg).on('message', (answer: string) => {
                            if (answer) {
                                this.bot.sendMessage(msg.chat.id, answer, { originalMessage: msg, parse_mode: 'Markdown' });
                            } else {
                                this.notFound(msg).on('message', (notFoundAnswer: string) => {
                                    this.bot.sendMessage(msg.chat.id, notFoundAnswer);
                                });
                            }
                        })
                        , 700);
                    break;
                }
            }
        });
    }
    protected notFound(msg: IBotMessage) {
        const event = new EventEmitter();
        setTimeout(() => {
            let founded = false;
            let j = 0;
            const len = this.plugins.length;
            for (j = 0; j < len; j++) {
                if (!founded && this.plugins[j]['name'] === 'api-ai') {
                    founded = true;
                    msg.text = 'bot.not_found';
                    this.plugins[j].process(this.bot, msg).on('message', (answer: string) => {
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
