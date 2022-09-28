import { APIMessage } from 'discord-api-types/payloads/v9';
import { Message } from 'discord.js';
import { Message as AplikoMessage } from '../../Message';
import { BaseInteraction } from './BaseInteraction';
export declare class RepliableInteraction extends BaseInteraction {
    private deferredEdit;
    private deferredReply;
    private replied;
    /**
     * ACK the interaction and show the user a loading state in a follow up message
     * Edit the reply later via {@link editReply}
     *
     * @param ephemeral When true, only the user can see the reply
     */
    deferReply(ephemeral?: boolean): Promise<void>;
    /**
     * ACK the interaction and send a follow up message.
     *
     * @param message The content of the follow up message
     * @param ephemeral When true, only the user can see the reply
     */
    reply(message: AplikoMessage, ephemeral?: boolean): Promise<Message<boolean> | APIMessage>;
    /**
     * Edit the message sent via @member deferReply or @member reply
     *
     * @param message The new content of the message
     */
    editReply(message: AplikoMessage): Promise<Message<boolean> | APIMessage>;
    /**
     * ACK the interaction and edit original message later.
     */
    defer(): Promise<void>;
    /**
     * If deferred or replied, updates the original message. If not, ACK's the interaction and updates the original message
     *
     * @param message The new content of the message
     */
    edit(message: AplikoMessage): Promise<void>;
    /**
     * Delets the original message
     */
    delete(): Promise<void>;
    handleError(error: any): Promise<void | Message<boolean> | APIMessage>;
    get wasReplyDeferred(): boolean;
    get wasEditDeferred(): boolean;
    get didReply(): boolean;
}
