"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
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
                        const hardBotAnswer = this.getHardBotAnswers(msg, answer);
                        if (hardBotAnswer) {
                            answer = hardBotAnswer;
                        }
                        event.emit('message', answer);
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
                    this.plugins[i].process(this.bot, msg).on('message', (answer) => {
                        if (answer) {
                            const hardBotAnswer = this.getHardBotAnswers(msg, answer);
                            if (hardBotAnswer) {
                                answer = hardBotAnswer;
                            }
                            this.bot.sendMessage(msg.chat.id, answer, { originalMessage: msg, parse_mode: 'Markdown' });
                        }
                        else {
                            this.notFound(msg).on('message', (notFoundAnswer) => {
                                this.bot.sendMessage(msg.chat.id, notFoundAnswer, { originalMessage: msg, parse_mode: 'Markdown' });
                            });
                        }
                    });
                    break;
                }
            }
        });
    }
    getHardBotAnswers(msg, answer) {
        const answers = [];
        let j = 0;
        const len = this.plugins.length;
        for (j = 0; j < len; j++) {
            if (answer.indexOf('answerWhatCanIdo') !== -1) {
                let message = this.plugins[j].answerWhatCanIdo(this.bot, msg);
                message = message.replace(new RegExp('`', 'ig'), '"');
                answers.push(message);
            }
        }
        if (answers.length > 0) {
            return answers.join('\n');
        }
        else {
            return '';
        }
    }
    notFound(msg) {
        const event = new events_1.EventEmitter();
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
        return event;
    }
}
exports.BaseBotServer = BaseBotServer;
