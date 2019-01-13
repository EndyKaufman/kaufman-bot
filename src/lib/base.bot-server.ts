import { EventEmitter } from 'events';

import { IBot, IBotMessage, IBotPlugin, IBotServer, IWebServer } from './interfaces';

declare function unescape(s: string): string;
declare function escape(s: string): string;

const stringify = require('json-stringify-safe');

export class BaseBotServer implements IBotServer {
    protected bot: IBot;
    protected webServer: IWebServer
    protected botToken: string;
    protected botHookUrl: string;
    protected plugins: IBotPlugin[];
    public events: EventEmitter;
    constructor(protected name: string, protected envName?: string) {
        this.events = new EventEmitter();
        if (this.plugins === undefined) {
            this.plugins = [];
        }
    }
    protected get envNamePrefix() {
        return !this.envName ? '' : this.envName.toUpperCase() + '_';
    }
    public env(key: string, defaultValue: any = '') {
        if (process.env[this.envNamePrefix + key]) {
            return process.env[this.envNamePrefix + key]
        } else {
            return defaultValue;
        }
    }
    public getName(): string {
        return this.name;
    }
    public sendCustomMessage(originalMsg: IBotMessage, message: string, userId: string, name?: string) {
        const newMsg: IBotMessage = JSON.parse(stringify(originalMsg));
        if (newMsg.originalData) {
            delete newMsg.originalData;
        }
        newMsg.chat.id = userId;
        this.events.emit('message', newMsg, {
            name: name || this.name,
            data: newMsg,
            message: message
        }, true)
    }
    public startPlugin(message: string, pluginName: string, locale: string): EventEmitter {
        const event = new EventEmitter();
        const msg: IBotMessage = {
            text: message,
            chat: {
                id: 'random',
                type: 'private'
            },
            from: {
                language_code: locale
            },
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
                this.plugins[i].process(this.bot, msg)
                    .on('message', (answer: string) => {
                        if (answer) {
                            const hardBotAnswer = this.getHardBotAnswers(msg, answer);
                            if (hardBotAnswer) {
                                answer = hardBotAnswer;
                            }
                            event.emit('message', answer);
                        } else {
                            this.notFound(msg).on('message', (notFoundAnswer: string) => {
                                event.emit('message', answer);
                            })
                        }
                    })
                    .on('customError', (answer: string) => {
                        event.emit('customError', answer);
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
        this.events.on('message', (msg: IBotMessage, data: any, stop: boolean) => {
            if (data) {
                let text = data;
                if (stop) {
                    text = '`' + stringify(data, null, 2).replace(new RegExp('`', 'ig'), '') + '`';
                }
                const r = /\\u([\d\w]{4})/gi;
                text = text.replace(r, function (match: any, grp: any) {
                    return String.fromCharCode(parseInt(grp, 16));
                });
                text = unescape(text);
                this.bot.sendMessage(msg.chat.id, text, { originalMessage: msg, parse_mode: 'Markdown' });
            }
        });
    }
    protected processUpdate() {
        this.webServer.app.post(this.actionUrl, (req: any, res: any) => {
            this.bot.processUpdate(req.body);
            res.sendStatus(200);
        });
    }
    protected processMessages() {
        this.bot.on('message', (msg: IBotMessage) => {
            this.events.emit('message', msg, false, false);
            try {
                if (this.env('BOT_LOCALE')) {
                    msg.from.language_code = this.env('BOT_LOCALE');
                }
                let founded = false;
                let i = 0;
                const len = this.plugins.length;
                for (i = 0; i < len; i++) {
                    if (!founded && this.plugins[i].check(this.bot, msg)) {
                        founded = true;
                        this.plugins[i].process(this.bot, msg)
                            .on('message', (answer: string) => {
                                if (answer) {
                                    const hardBotAnswer = this.getHardBotAnswers(msg, answer);
                                    if (hardBotAnswer) {
                                        answer = hardBotAnswer;
                                    }
                                    answer = answer.replace(new RegExp('«', 'ig'), '"').replace(new RegExp('»', 'ig'), '"');
                                    this.events.emit('message', msg, answer);
                                } else {
                                    this.notFound(msg).on('message', (notFoundAnswer: string) => {
                                        this.events.emit('message', msg, notFoundAnswer);
                                    });
                                }
                            })
                            .on('customError', (answer: string) => {
                                this.events.emit('customError', msg, answer);
                            });
                        break;
                    }
                }
            } catch (error) {
                this.events.emit('customError', msg, error);
            }
        });
    }
    protected getHardBotAnswers(msg: IBotMessage, answer: string): string {
        const answers: string[] = [];

        let j = 0;
        const len = this.plugins.length;
        for (j = 0; j < len; j++) {
            if (answer.indexOf('answerWhatCanIdo') !== -1) {
                const message = this.plugins[j].answerWhatCanIdo(this.bot, msg);
                answers.push(message);
            }
        }
        if (answers.length > 0) {
            return answers.join('\n');
        } else {
            return '';
        }
    }
    protected notFound(msg: IBotMessage) {
        const event = new EventEmitter();
        let founded = false;
        let j = 0;
        const len = this.plugins.length;
        for (j = 0; j < len; j++) {
            if (!founded && this.plugins[j]['name'] === 'api-ai') {
                founded = true;
                msg.text = 'bot.response:notFound';
                this.plugins[j].process(this.bot, msg).on('message', (answer: string) => {
                    event.emit('message', answer);
                });
                break;
            }
        }
        if (!founded) {
            event.emit('message', 'Error! ApiAiPlugin not founded :(');
        }
        return event;
    }
}
