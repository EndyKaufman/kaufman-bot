"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const dotenv_1 = require("dotenv");
const server_1 = require("../server");
const bot_1 = require("../bot");
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
            .parse(process.argv);
        let selected = false;
        if (!selected && this.program.plugin) {
            selected = true;
            const bot = new bot_1.Bot();
            bot.startPlugin(this.program.message, this.program.plugin === true ? null : this.program.plugin)
                .on('message', (answer) => {
                console.log(answer);
                process.exit(0);
            });
        }
        if (!selected && this.program.start) {
            selected = true;
            const server = new server_1.Server();
            const bot = new bot_1.Bot();
            bot.startEndpoint(server);
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
