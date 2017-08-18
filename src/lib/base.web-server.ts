import * as express from 'express';
import * as bodyParser from 'body-parser';
import { IWebServer } from './interfaces';

const Rollbar = require('rollbar');

export class BaseWebServer implements IWebServer {
    public app: any;
    public rollbar: any;
    constructor(protected name?: string) {
        this.app = express();
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
    public start(port: string, rollbarPostServerItemAccessToken?: string) {
        if (rollbarPostServerItemAccessToken) {
            this.rollbar = new Rollbar(rollbarPostServerItemAccessToken);
            this.app.use(this.rollbar.errorHandler());
        }
        this.app.use(bodyParser.json());
        this.app.listen(port, () => {
            console.log(`Express server is listening on ${port}`);
        });
    }

}
