"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const dotenv_1 = require("dotenv");
const server_1 = require("../server");
class App {
    constructor() {
        dotenv_1.config();
        this.program = commander;
        this.package = require('../../package.json');
        this.server = new server_1.Server();
    }
    initialize() {
        this.program
            .version(this.package.version)
            .option('-s, --start', 'start express server')
            .option('-p, --plugin [plugin]', 'plugin name for start')
            .option('-m, --message [message]', 'input message for plugin')
            .parse(process.argv);
        if (this.program.plugin) {
            this.server.startPlugin(this.program.message, this.program.plugin === true ? null : this.program.plugin)
                .on('message', (answer) => {
                console.log(answer);
                process.exit(0);
            });
        }
        else {
            if (this.program.start) {
                this.server.start();
            }
            else {
                this.program.help();
            }
        }
    }
}
exports.App = App;
let app = new App();
app.initialize();
