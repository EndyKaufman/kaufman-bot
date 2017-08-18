"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const microsoft_bot_server_1 = require("../bots/microsoft.bot-server");
const commander = require("commander");
const dotenv_1 = require("dotenv");
const server_1 = require("../server");
const telegram_bot_server_1 = require("../bots/telegram.bot-server");
class App {
    constructor() {
        dotenv_1.config();
        this.program = commander;
        this.package = require('../../package.json');
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
                console.log('TelegramBotServer: ' + answer);
            });
            microsoftBotServer.startPlugin(this.program.message, this.program.plugin === true ? null : this.program.plugin, this.program.locale ? this.program.locale : process.env.BOT_LOCALE).on('message', (answer) => {
                console.log('MicrosoftBotServer: ' + answer);
            });
        }
        if (!selected && this.program.start) {
            selected = true;
            const webServer = new server_1.WebServer();
            const telegramBotServer = new telegram_bot_server_1.TelegramBotServer();
            const microsoftBotServer = new microsoft_bot_server_1.MicrosoftBotServer();
            telegramBotServer.startEndpoint(webServer);
            microsoftBotServer.startEndpoint(webServer);
            telegramBotServer.events.on('error', (msg, error, stop = false) => {
                const originalMsg = msg;
                msg.chat.id = telegramBotServer.env('BOT_ADMIN_TELEGRAM_ID');
                if (!stop) {
                    telegramBotServer.events.emit('message', msg, JSON.stringify({ msg: msg, error: `Error ${error.name}: ${error.message}\n${error.stack}` }), true);
                }
            });
            telegramBotServer.events.on('message', (msg, message, stop = false) => {
                const originalMsg = msg;
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
exports.App = App;
const app = new App();
app.initialize();
