import { Message } from 'discord.js';

/*
 * Deletes a message with an extremely short timeout to prevent
 * client side bugs that show deleted messages
 */
export const SafeDeleteMessage = (message: Message) => {
    setTimeout(() => message.delete().catch(() => {}), 50);
};
