import * as commander from 'commander';
import { config } from 'dotenv';
import { Server } from '../server';
import { Bot } from '../bot';

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
            const bot = new Bot();
            bot.startPlugin(this.program.message, this.program.plugin === true ? null : this.program.plugin)
                .on('message', (answer: string) => {
                    console.log(answer);
                    process.exit(0);
                })
        }
        if (!selected && this.program.start) {
            selected = true;
            const server = new Server();
            const bot = new Bot();
            bot.startEndpoint(server);
        }

        if (!selected) {
            selected = true;
            this.program.help();
        }
    }
}
const app = new App();
app.initialize();
