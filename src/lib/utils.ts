import * as _ from 'lodash';
export function checkWordsInMessage(message: string, words: string[]): boolean {
    const messageWords = _.words((message ? message : '').toLowerCase());
    return words.filter(word =>
        messageWords.map(messageWord => messageWord.trim()).indexOf((word ? word.trim() : '').toLowerCase()) !== -1
    ).length > 0;
}
export function removeWordsFromMessage(message: string, words: string[]): string {
    words.map(word => message = message.replace(new RegExp(word.trim(), 'ig'), ''));
    return message.trim();
}
