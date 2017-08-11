"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
function checkWordsInMessage(message, words) {
    const messageWords = _.words((message ? message : '').toLowerCase());
    return words.filter(word => messageWords.indexOf((word ? word : '').toLowerCase()) !== -1).length > 0;
}
exports.checkWordsInMessage = checkWordsInMessage;
function removeWordsFromMessage(message, words) {
    words.map(word => message = message.replace(new RegExp(word, 'ig'), ''));
    return message;
}
exports.removeWordsFromMessage = removeWordsFromMessage;
