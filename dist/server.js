"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
class Server {
    constructor(name) {
        this.name = name;
        this.port = process.env[this.namePrefix + 'PORT'];
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.listen(this.port, () => {
            console.log(`Express server is listening on ${this.port}`);
        });
    }
    get namePrefix() {
        return this.name === undefined ? '' : this.name.toUpperCase() + '_';
    }
}
exports.Server = Server;
