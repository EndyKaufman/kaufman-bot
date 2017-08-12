import * as express from 'express';
import * as bodyParser from 'body-parser';
import { IWebServer } from './interfaces';

export class BaseWebServer implements IWebServer {
    public app: any;
    protected port: string;
    constructor(protected name?: string) {
        this.port = process.env[this.namePrefix + 'PORT'];
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.listen(this.port, () => {
            console.log(`Express server is listening on ${this.port}`);
        });
    }
    protected get namePrefix() {
        return this.name === undefined ? '' : this.name.toUpperCase() + '_';
    }

}
