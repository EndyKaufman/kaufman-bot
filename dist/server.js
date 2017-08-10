"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_server_1 = require("./lib/base.server");
class Server extends base_server_1.BaseServer {
    constructor(name) {
        super(name);
        this.name = name;
    }
}
exports.Server = Server;
