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
const EventEmitter = require('events');

// ai bot
const ai = apiai(APIAI_CLIENT_ACCESS_TOKEN);

// No need to pass any parameters as we will handle the updates with Express
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${TELEGRAM_HOOK_URL}/bot${TELEGRAM_TOKEN}`);

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

const botNames = ['kaufman', 'кауфман', 'кафман', 'endy', 'енди', 'энди'];

function checkBotNameInMessage(msg) {
    for (var i = 0; i < botNames.length; i++) {
        if (msg.toLowerCase().indexOf(botNames[i].toLowerCase()) !== -1) {
            return true;
        }
    }
    return false;
}
function removeBotNamesFromMessage(msg) {
    for (var i = 0; i < botNames.length; i++) {
        msg = msg.replace(new RegExp(botNames[i], "ig"), '');
    }
    return msg;
}
function getAiAnswer(msg, sessionId) {
    const event = new EventEmitter();
    const request = ai.textRequest(msg, {
        sessionId: sessionId
    });

    request.on('response', function (response) {
        event.emit('event', response.result.fulfillment.speech);
    });

    request.end();
    return event;
}

bot.on('message', msg => {
    if (typeof msg.text === 'string' && (checkBotNameInMessage(msg.text) || msg.chat.type === 'private')) {
        getAiAnswer(msg.text, msg.chat.id).on('event', function (answer) {
            if (answer) {
                bot.sendMessage(msg.chat.id, answer);
            } else {
                getAiAnswer(removeBotNamesFromMessage(msg.text), msg.date).on('event', function (answer) {
                    if (answer) {
                        bot.sendMessage(msg.chat.id, answer);
                    }
                })
            }
        })
    }
});