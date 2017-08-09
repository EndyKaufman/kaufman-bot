import * as commander from 'commander';
import { config } from 'dotenv';
import { Server } from '../server';

export class App {

    private program: commander.CommanderStatic;
    private package: any;
    private server: Server;

    constructor() {

        config();

        this.program = commander;
        this.package = require('../../package.json');
        this.server = new Server();
    }

    public initialize() {
        this.program
            .version(this.package.version)
            .option('-s, --start', 'start express server')
            .option('-p, --plugin [plugin]', 'plugin name for start')
            .option('-m, --message [message]', 'input message for plugin')
            .parse(process.argv);

        if (this.program.plugin) {
            this.server.startPlugin(this.program.message, this.program.plugin === true ? null : this.program.plugin)
                .on('message', (answer: string) => {
                    console.log(answer);
                    process.exit(0);
                })
        } else {
            if (this.program.start) {
                this.server.start();
            } else {
                this.program.help();
            }
        }
    }

}

let app = new App();
app.initialize();
