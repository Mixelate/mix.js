"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdFromMention = void 0;
function getUserIdFromMention(mention) {
    if (!mention)
        return '';
    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);
        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }
        return mention;
    }
    return '';
}
exports.getUserIdFromMention = getUserIdFromMention;
