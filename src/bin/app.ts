import { MicrosoftBotServer } from '../bots/microsoft.bot-server';
import * as commander from 'commander';
import { config } from 'dotenv';
import { WebServer } from '../server';
import { TelegramBotServer } from '../bots/telegram.bot-server';
import { IBotMessage, IBotServer } from '../lib/interfaces';
import * as _ from 'lodash';

const stringify = require('json-stringify-safe');

export class App {
    protected program: commander.CommanderStatic;
    protected package: any;
    protected adminTelegramUserId: string;
    protected port: string;
    protected debug: boolean;
    protected rollbarPostServerItemAccessToken: string;
    constructor() {
        config();
        this.adminTelegramUserId = this.env('ADMIN_TELEGRAM_USER_ID');
        this.port = this.env('PORT');
        this.debug = this.env('DEBUG') === 'true';
        this.rollbarPostServerItemAccessToken = this.env('ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN');
        this.program = commander;
        this.package = require('../../package.json');
    }
    public env(name: string, defaultValue?: any): any {
        if (defaultValue === undefined) {
            defaultValue = null;
        }
        if (process.env[name]) {
            return process.env[name]
        } else {
            return defaultValue;
        }
    }
    public initialize() {
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
            const telegramBotServer = new TelegramBotServer();
            const microsoftBotServer = new MicrosoftBotServer();
            telegramBotServer.startPlugin(
                this.program.message,
                this.program.plugin === true ? null : this.program.plugin,
                this.program.locale ? this.program.locale : process.env.BOT_LOCALE
            ).on('message', (answer: string) => {
                console.log('TelegramBotServer1: ' + answer);
            })
            microsoftBotServer.startPlugin(
                this.program.message,
                this.program.plugin === true ? null : this.program.plugin,
                this.program.locale ? this.program.locale : process.env.BOT_LOCALE
            ).on('message', (answer: string) => {
                console.log('MicrosoftBotServer1: ' + answer);
            })
        }
        if (!selected && this.program.start) {
            selected = true;
            const webServer = new WebServer();
            const telegramBotServer = new TelegramBotServer();
            const microsoftBotServer = new MicrosoftBotServer();
            webServer.start(this.port, this.rollbarPostServerItemAccessToken);
            telegramBotServer.startEndpoint(webServer);
            microsoftBotServer.startEndpoint(webServer);
            telegramBotServer.events.on('error', (msg: IBotMessage, error: any, stop: boolean = false) => {
                if (!stop) {
                    if (msg.originalData) {
                        delete msg.originalData;
                    }
                    msg = JSON.parse(stringify(msg));
                    const originalMsg: IBotMessage = msg;
                    msg.chat.id = this.adminTelegramUserId;
                    telegramBotServer.events.emit('message', msg, {
                        name: 'TelegramBotServer1',
                        data: originalMsg,
                        error: `Error ${error.name}: ${error.message}\n${error.stack}`
                    }, true);
                }
            });
            telegramBotServer.events.on('message', (msg: IBotMessage, message: string, stop: boolean = false) => {
                if (!stop) {
                    if (message && (_.toString(msg.chat.id) === _.toString(this.adminTelegramUserId)) && msg.text && msg.text.toLowerCase().indexOf('debug') !== -1) {
                        this.debug = !this.debug;
                    }
                    if (this.debug) {
                        if (msg.originalData) {
                            delete msg.originalData;
                        }
                        msg = JSON.parse(stringify(msg));
                        const originalMsg: IBotMessage = msg;
                        msg.chat.id = this.adminTelegramUserId;
                        telegramBotServer.events.emit('message', msg, {
                            name: 'TelegramBotServer1',
                            data: originalMsg,
                            answer: message
                        }, true);
                    }
                }
            });
            microsoftBotServer.events.on('error', (msg: IBotMessage, error: any, stop: boolean = false) => {
                if (!stop) {
                    if (msg.originalData) {
                        delete msg.originalData;
                    }
                    msg = JSON.parse(stringify(msg));
                    const originalMsg: IBotMessage = msg;
                    msg.chat.id = this.adminTelegramUserId;
                    telegramBotServer.events.emit('message', msg, {
                        name: 'MicrosoftBotServer1',
                        data: originalMsg,
                        error: `Error ${error.name}: ${error.message}\n${error.stack}`
                    }, true);
                }
            });
            microsoftBotServer.events.on('message', (msg: IBotMessage, message: string, stop: boolean = false) => {
                if (!stop) {
                    if (message && (_.toString(msg.chat.id) === _.toString(this.adminTelegramUserId)) && msg.text && msg.text.toLowerCase().indexOf('debug') !== -1) {
                        this.debug = !this.debug;
                    }
                    if (this.debug && message) {
                        if (msg.originalData) {
                            delete msg.originalData;
                        }
                        msg = JSON.parse(stringify(msg));
                        const originalMsg: IBotMessage = msg;
                        msg.chat.id = this.adminTelegramUserId;
                        telegramBotServer.events.emit('message', msg, {
                            name: 'MicrosoftBotServer1',
                            data: originalMsg,
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
const app = new App();
app.initialize();
