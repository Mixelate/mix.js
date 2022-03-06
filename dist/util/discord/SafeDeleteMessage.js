"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeDeleteMessage = void 0;
/*
 * Deletes a message with an extremely short timeout to prevent
 * client side bugs that show deleted messages
 */
const SafeDeleteMessage = (message) => {
    setTimeout(() => message.delete().catch(() => { }), 50);
};
exports.SafeDeleteMessage = SafeDeleteMessage;
