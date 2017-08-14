import { MicrosoftBotServer } from '../bots/microsoft.bot-server';
import * as commander from 'commander';
import { config } from 'dotenv';
import { WebServer } from '../server';
import { TelegramBotServer } from '../bots/telegram.bot-server';

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
            .parse(process.argv);
        let selected = false;
        if (!selected && this.program.plugin) {
            selected = true;
            const telegramBotServer = new TelegramBotServer();
            const microsoftBotServer = new MicrosoftBotServer();
            telegramBotServer.startPlugin(this.program.message, this.program.plugin === true ? null : this.program.plugin)
                .on('message', (answer: string) => {
                    console.log('TelegramBotServer: ' + answer);
                })
            microsoftBotServer.startPlugin(this.program.message, this.program.plugin === true ? null : this.program.plugin)
                .on('message', (answer: string) => {
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
        }

        if (!selected) {
            selected = true;
            this.program.help();
        }
    }
}
const app = new App();
app.initialize();
