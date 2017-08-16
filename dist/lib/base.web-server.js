"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const rollbar = require('rollbar');
class BaseWebServer {
    constructor(name) {
        this.name = name;
        this.port = this.env('PORT');
        this.app = express();
        this.app.use(bodyParser.json());
        if (this.env('DEBUG') !== 'true') {
            this.app.use(rollbar.errorHandler(this.env('ROLLBAR_SERVER_ACCESS_TOKEN')));
        }
        this.app.listen(this.port, () => {
            console.log(`Express server is listening on ${this.port}`);
        });
    }
    get namePrefix() {
        return !this.name ? '' : this.name.toUpperCase() + '_';
    }
    env(name, defaultValue = '') {
        if (process.env[this.namePrefix + name]) {
            return process.env[this.namePrefix + name];
        }
        else {
            return defaultValue;
        }
    }
}
exports.BaseWebServer = BaseWebServer;
