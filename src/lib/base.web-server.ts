import * as express from 'express';
import * as bodyParser from 'body-parser';
import { IWebServer } from './interfaces';

export class BaseWebServer implements IWebServer {
    public app: any;
    protected port: string;
    constructor(protected name?: string) {
        this.port = this.env('PORT');
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.listen(this.port, () => {
            console.log(`Express server is listening on ${this.port}`);
        });
    }
    protected get namePrefix() {
        return !this.name ? '' : this.name.toUpperCase() + '_';
    }
    protected env(name: string, defaultValue: any = '') {
        if (process.env[this.namePrefix + name]) {
            return process.env[this.namePrefix + name]
        } else {
            return defaultValue;
        }
    }

}
