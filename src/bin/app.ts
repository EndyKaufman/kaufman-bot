import { MicrosoftBotServer } from '../bots/microsoft.bot-server';
import * as commander from 'commander';
import { config } from 'dotenv';
import { WebServer } from '../server';
import { TelegramBotServer } from '../bots/telegram.bot-server';
import { IBotMessage } from '../lib/interfaces';

export class App {
    protected program: commander.CommanderStatic;
    protected package: any;
    constructor() {
        config();
        this.program = commander;
        this.package = require('../../package.json');
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
                console.log('TelegramBotServer: ' + answer);
            })
            microsoftBotServer.startPlugin(
                this.program.message,
                this.program.plugin === true ? null : this.program.plugin,
                this.program.locale ? this.program.locale : process.env.BOT_LOCALE
            ).on('message', (answer: string) => {
                console.log('MicrosoftBotServer: ' + answer);
            })
        }
        if (!selected && this.program.start) {
            selected = true;
            const webServer = new WebServer();
            const telegramBotServer = new TelegramBotServer();
            const microsoftBotServer = new MicrosoftBotServer();
            telegramBotServer.startEndpoint(webServer);
            microsoftBotServer.startEndpoint(webServer);
            telegramBotServer.events.on('error', (msg: IBotMessage, error: any, stop: boolean = false) => {
                const originalMsg: IBotMessage = msg;
                msg.chat.id = telegramBotServer.env('BOT_ADMIN_TELEGRAM_ID');
                if (!stop) {
                    telegramBotServer.events.emit('message', msg, JSON.stringify({ msg: msg, error: `Error ${error.name}: ${error.message}\n${error.stack}` }), true);
                }
            });
            telegramBotServer.events.on('message', (msg: IBotMessage, message: string, stop: boolean = false) => {
                const originalMsg: IBotMessage = msg;
                msg.chat.id = telegramBotServer.env('BOT_ADMIN_TELEGRAM_ID');
                if (!stop) {
                    telegramBotServer.events.emit('message', msg, JSON.stringify({ msg: msg, answer: message }), true);
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
