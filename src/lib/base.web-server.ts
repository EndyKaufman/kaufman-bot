import * as express from 'express';
import * as bodyParser from 'body-parser';
import { IWebServer } from './interfaces';

const Rollbar = require('rollbar');

export class BaseWebServer implements IWebServer {
    public app: any;
    public rollbar: any;
    protected port: string;
    constructor(protected name?: string) {
        this.port = this.env('PORT');
        this.app = express();
        /*if (this.env('DEBUG') === 'true') {
            this.rollbar = new Rollbar('ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN');
            this.app.use(this.rollbar.errorHandler());
        }*/
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
