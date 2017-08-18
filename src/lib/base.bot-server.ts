import { setTimeout } from 'timers';
import { EventEmitter } from 'events';
import { IBotPlugin, IBotMessage, IBotServer, IBot, IWebServer } from './interfaces';
import { checkWordsInMessage } from './utils';

export class BaseBotServer implements IBotServer {
    protected bot: IBot;
    protected webServer: IWebServer
    protected botToken: string;
    protected botHookUrl: string;
    protected plugins: IBotPlugin[];
    public events: EventEmitter;
    constructor(protected name?: string) {
        this.events = new EventEmitter();
        if (this.plugins === undefined) {
            this.plugins = [];
        }
    }
    protected get namePrefix() {
        return !this.name ? '' : this.name.toUpperCase() + '_';
    }
    public env(name: string, defaultValue?: any): any {
        if (defaultValue === undefined) {
            defaultValue = null;
        }
        if (process.env[this.namePrefix + name]) {
            return process.env[this.namePrefix + name]
        } else {
            return defaultValue;
        }
    }
    public sendMessageToAdmin() {

    }
    public startPlugin(message: string, pluginName: string, locale: string) {
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
                this.plugins[i].process(this.bot, msg).on('message', (answer: string) => {
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
                    text = '`' + JSON.stringify(data, null, 2).replace(new RegExp('`', 'ig'), '') + '`';
                }
                this.bot.sendMessage(msg.chat.id, text, { originalMessage: msg, parse_mode: 'Markdown' });
            }
        });
        this.events.on('error', (msg: IBotMessage, error: any) => {
            this.bot.sendMessage(msg.chat.id, `Error ${error.name}: ${error.message}\n${error.stack}`, { originalMessage: msg, parse_mode: 'Markdown' });
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
                        this.plugins[i].process(this.bot, msg).on('message', (answer: string) => {
                            if (answer) {
                                const hardBotAnswer = this.getHardBotAnswers(msg, answer);
                                if (hardBotAnswer) {
                                    answer = hardBotAnswer;
                                }
                                this.events.emit('message', msg, answer);
                            } else {
                                this.notFound(msg).on('message', (notFoundAnswer: string) => {
                                    this.events.emit('message', msg, notFoundAnswer);
                                });
                            }
                        });
                        break;
                    }
                }
            } catch (error) {
                this.events.emit('error', msg, error);
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
