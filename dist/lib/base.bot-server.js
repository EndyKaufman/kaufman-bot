"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timers_1 = require("timers");
const events_1 = require("events");
const utils_1 = require("./utils");
class BaseBotServer {
    constructor(name) {
        this.name = name;
        this.debug = false;
        if (this.plugins === undefined) {
            this.plugins = [];
        }
    }
    get namePrefix() {
        return !this.name ? '' : this.name.toUpperCase() + '_';
    }
    env(name, defaultValue = '') {
        if (process.env[this.namePrefix + name]) {
            return process.env[this.namePrefix + name];
        }
        else {
            return defaultValue;
        }
    }
    startPlugin(message, pluginName, locale) {
        const event = new events_1.EventEmitter();
        const msg = {
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
            if (!founded &&
                (pluginName === null && this.plugins[i].check(this.bot, msg)) ||
                (pluginName !== null && this.plugins[i].name === pluginName)) {
                founded = true;
                this.plugins[i].process(this.bot, msg).on('message', (answer) => {
                    if (answer) {
                        this.checkHardBotAnswers(msg, answer).on('message', (hardBotAnswer) => {
                            if (hardBotAnswer) {
                                answer = hardBotAnswer;
                            }
                            event.emit('message', answer);
                        });
                    }
                    else {
                        this.notFound(msg).on('message', (notFoundAnswer) => {
                            event.emit('message', answer);
                        });
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
    startEndpoint(server) {
        this.webServer = server;
        this.processUpdate();
        this.processHook();
        this.processMessages();
    }
    get actionUrl() {
        return `/bot${this.botToken}`;
    }
    processHook() {
        if (this.botHookUrl) {
            this.bot.setWebHook(this.botHookUrl + this.actionUrl);
        }
    }
    processUpdate() {
        this.webServer.app.post(this.actionUrl, (req, res) => {
            this.bot.processUpdate(req.body);
            res.sendStatus(200);
        });
    }
    processMessages() {
        this.bot.on('message', (msg) => {
            let founded = false;
            let i = 0;
            const len = this.plugins.length;
            for (i = 0; i < len; i++) {
                if (!founded && this.plugins[i].check(this.bot, msg)) {
                    founded = true;
                    timers_1.setTimeout(() => this.plugins[i].process(this.bot, msg).on('message', (answer) => {
                        if (answer) {
                            this.checkHardBotAnswers(msg, answer).on('message', (hardBotAnswer) => {
                                if (!this.debug && hardBotAnswer) {
                                    answer = hardBotAnswer;
                                }
                                this.bot.sendMessage(msg.chat.id, answer, { originalMessage: msg, parse_mode: 'Markdown' });
                            });
                        }
                        else {
                            this.notFound(msg).on('message', (notFoundAnswer) => {
                                this.bot.sendMessage(msg.chat.id, notFoundAnswer, { originalMessage: msg, parse_mode: 'Markdown' });
                            });
                        }
                    }), 100);
                    break;
                }
            }
        });
    }
    checkHardBotAnswers(msg, answer) {
        const event = new events_1.EventEmitter();
        const methodName = answer.replace('bot.request:', '');
        const answers = [];
        timers_1.setTimeout(() => {
            let founded = false;
            if (methodName !== answer) {
                let j = 0;
                const len = this.plugins.length;
                for (j = 0; j < len; j++) {
                    if (utils_1.checkWordsInMessage(methodName, ['answerWhatCanIdo'])) {
                        founded = true;
                        answers.push(this.plugins[j].answerWhatCanIdo(this.bot, msg));
                    }
                }
            }
            if (founded) {
                event.emit('message', answers.join('\n'));
            }
            else {
                event.emit('message', false);
            }
        }, 100);
        return event;
    }
    notFound(msg) {
        const event = new events_1.EventEmitter();
        timers_1.setTimeout(() => {
            let founded = false;
            let j = 0;
            const len = this.plugins.length;
            for (j = 0; j < len; j++) {
                if (!founded && this.plugins[j]['name'] === 'api-ai') {
                    founded = true;
                    msg.text = 'bot.response:notFound';
                    this.plugins[j].process(this.bot, msg).on('message', (answer) => {
                        event.emit('message', answer);
                    });
                    break;
                }
            }
            if (!founded) {
                event.emit('message', 'Error! ApiAiPlugin not founded :(');
            }
        }, 100);
        return event;
    }
}
exports.BaseBotServer = BaseBotServer;
