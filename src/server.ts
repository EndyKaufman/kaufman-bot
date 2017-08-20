import * as express from 'express';
import { BaseWebServer } from './lib/base.web-server';

export class WebServer extends BaseWebServer {
    constructor(protected name: string, protected envName?: string) {
        super(name, envName);
    }

}
