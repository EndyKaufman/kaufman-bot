import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Bot } from './bot';
import { BaseServer } from './lib/base.server';

export class Server extends BaseServer {
    constructor(protected name?: string) {
        super(name);
    }

}
