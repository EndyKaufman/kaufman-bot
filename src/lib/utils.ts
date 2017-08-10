import * as _ from 'lodash';
export function checkWordsInMessage(message: string, words: string[]): boolean {
    const messageWords = _.words((message ? message : '').toLowerCase());
    return words.filter(word =>
        messageWords.indexOf((word ? word : '').toLowerCase()) !== -1
    ).length > 0;
}
export function removeWordsFromMessage(message: string, words: string[]): string {
    words.map(word => message = message.replace(new RegExp(word, "ig"), ''))
    return message;
}