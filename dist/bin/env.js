"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
class Env {
    constructor() {
        dotenv_1.config();
        this.TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
        this.TELEGRAM_HOOK_URL = process.env.TELEGRAM_HOOK_URL;
        this.PORT = process.env.PORT;
        this.APIAI_CLIENT_ACCESS_TOKEN = process.env.APIAI_CLIENT_ACCESS_TOKEN;
    }
}
exports.Env = Env;
exports.default = new Env();
