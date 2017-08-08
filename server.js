/**
 * This example demonstrates setting up a webook, and receiving
 * updates in your express app
 */
/* eslint-disable no-console */

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_HOOK_URL = process.env.TELEGRAM_HOOK_URL;
const PORT = process.env.PORT;
const APIAI_CLIENT_ACCESS_TOKEN = process.env.APIAI_CLIENT_ACCESS_TOKEN;

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const apiai = require('apiai');

// ai bot
const ai = apiai(APIAI_CLIENT_ACCESS_TOKEN);

// No need to pass any parameters as we will handle the updates with Express
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// This informs the Telegram servers of the new webhook.
//bot.setWebHook(`${TELEGRAM_HOOK_URL}/bot${TELEGRAM_TOKEN}`);

const app = express();

// parse the updates to JSON
app.use(bodyParser.json());

// We are receiving updates at the route below!
app.post(`/bot${TELEGRAM_TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`Express server is listening on ${PORT}`);
});

// Just to ping!
bot.on('message', msg => {
    if (typeof msg.text === 'string' &&
        (msg.text.indexOf('endy') !== -1 || msg.text.indexOf('енди') !== -1 || msg.text.indexOf('энди') !== -1)
    ) {
        const request = ai.textRequest(msg.text, {
            sessionId: msg.date
        });

        request.on('response', function (response) {
            bot.sendMessage(msg.chat.id, response.result.fulfillment.speech);
        });

        request.on('error', function (error) {
            console.log(error);
        });

        request.end();
    }
});