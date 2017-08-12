"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_web_server_1 = require("./lib/base.web-server");
class WebServer extends base_web_server_1.BaseWebServer {
    constructor(name) {
        super(name);
        this.name = name;
    }
}
exports.WebServer = WebServer;
