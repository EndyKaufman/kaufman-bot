import * as express from 'express';
import * as bodyParser from 'body-parser';
import { IWebServer } from './interfaces';

const Rollbar = require('rollbar');

export class BaseWebServer implements IWebServer {
    public app: any;
    public rollbar: any;
    constructor(protected name: string, protected envName?: string) {
        this.app = express();
    }
    protected get envNamePrefix() {
        return !this.envName ? '' : this.envName.toUpperCase() + '_';
    }
    protected env(key: string, defaultValue: any = '') {
        if (process.env[this.envNamePrefix + key]) {
            return process.env[this.envNamePrefix + key];
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
