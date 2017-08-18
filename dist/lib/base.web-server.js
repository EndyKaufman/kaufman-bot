"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const Rollbar = require('rollbar');
class BaseWebServer {
    constructor(name) {
        this.name = name;
        this.app = express();
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
    start(port, rollbarPostServerItemAccessToken) {
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
exports.BaseWebServer = BaseWebServer;
