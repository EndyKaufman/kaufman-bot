import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Bot } from './bot';

export class Server {
    public app: any;
    private port: string;
    constructor(private name?: string) {
        this.port = process.env[this.namePrefix + 'PORT'];
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.listen(this.port, () => {
            console.log(`Express server is listening on ${this.port}`);
        });
    }
    private get namePrefix() {
        return this.name === undefined ? '' : this.name.toUpperCase() + '_';
    }

}
