"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const microsoft_bot_server_1 = require("../bots/microsoft.bot-server");
const commander = require("commander");
const dotenv_1 = require("dotenv");
const server_1 = require("../server");
const telegram_bot_server_1 = require("../bots/telegram.bot-server");
const _ = require("lodash");
class App {
    constructor() {
        dotenv_1.config();
        this.adminTelegramUserId = this.env('ADMIN_TELEGRAM_USER_ID');
        this.port = this.env('PORT');
        this.debug = this.env('DEBUG') === 'true';
        this.rollbarPostServerItemAccessToken = this.env('ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN');
        this.program = commander;
        this.package = require('../../package.json');
    }
    env(name, defaultValue) {
        if (defaultValue === undefined) {
            defaultValue = null;
        }
        if (process.env[name]) {
            return process.env[name];
        }
        else {
            return defaultValue;
        }
    }
    initialize() {
        this.program
            .version(this.package.version)
            .option('-s, --start', 'start express server')
            .option('-p, --plugin [plugin]', 'plugin name for start')
            .option('-m, --message [message]', 'input message for plugin')
            .option('-l, --locale [message]', 'set bot language')
            .parse(process.argv);
        let selected = false;
        if (!selected && this.program.plugin) {
            selected = true;
            const telegramBotServer = new telegram_bot_server_1.TelegramBotServer();
            const microsoftBotServer = new microsoft_bot_server_1.MicrosoftBotServer();
            telegramBotServer.startPlugin(this.program.message, this.program.plugin === true ? null : this.program.plugin, this.program.locale ? this.program.locale : process.env.BOT_LOCALE).on('message', (answer) => {
                console.log('TelegramBotServer1: ' + answer);
            });
            microsoftBotServer.startPlugin(this.program.message, this.program.plugin === true ? null : this.program.plugin, this.program.locale ? this.program.locale : process.env.BOT_LOCALE).on('message', (answer) => {
                console.log('MicrosoftBotServer1: ' + answer);
            });
        }
        if (!selected && this.program.start) {
            selected = true;
            const webServer = new server_1.WebServer();
            const telegramBotServer = new telegram_bot_server_1.TelegramBotServer();
            const microsoftBotServer = new microsoft_bot_server_1.MicrosoftBotServer();
            webServer.start(this.port, this.rollbarPostServerItemAccessToken);
            telegramBotServer.startEndpoint(webServer);
            microsoftBotServer.startEndpoint(webServer);
            telegramBotServer.events.on('error', (msg, error, stop = false) => {
                if (!stop) {
                    const originalMsg = msg;
                    msg.chat.id = this.adminTelegramUserId;
                    telegramBotServer.events.emit('message', msg, {
                        name: 'TelegramBotServer1',
                        msg: msg,
                        error: `Error ${error.name}: ${error.message}\n${error.stack}`
                    }, true);
                }
            });
            telegramBotServer.events.on('message', (msg, message, stop = false) => {
                if (!stop) {
                    if (message && (_.toString(msg.chat.id) === _.toString(this.adminTelegramUserId)) && msg.text.toLowerCase().indexOf('debug') !== -1) {
                        this.debug = !this.debug;
                    }
                    if (this.debug) {
                        const originalMsg = msg;
                        msg.chat.id = this.adminTelegramUserId;
                        telegramBotServer.events.emit('message', msg, {
                            name: 'TelegramBotServer1',
                            msg: msg,
                            answer: message
                        }, true);
                    }
                }
            });
            microsoftBotServer.events.on('error', (msg, error, stop = false) => {
                if (!stop) {
                    const originalMsg = msg;
                    msg.chat.id = this.adminTelegramUserId;
                    telegramBotServer.events.emit('message', msg, {
                        name: 'MicrosoftBotServer1',
                        msg: msg,
                        error: `Error ${error.name}: ${error.message}\n${error.stack}`
                    }, true);
                }
            });
            microsoftBotServer.events.on('message', (msg, message, stop = false) => {
                if (!stop) {
                    if (message && (_.toString(msg.chat.id) === _.toString(this.adminTelegramUserId)) && msg.text.toLowerCase().indexOf('debug') !== -1) {
                        this.debug = !this.debug;
                    }
                    if (this.debug && message) {
                        const originalMsg = msg;
                        msg.chat.id = this.adminTelegramUserId;
                        telegramBotServer.events.emit('message', msg, {
                            name: 'MicrosoftBotServer1',
                            msg: msg,
                            answer: message
                        }, true);
                    }
                }
            });
        }
        if (!selected) {
            selected = true;
            this.program.help();
        }
    }
}
exports.App = App;
const app = new App();
app.initialize();
