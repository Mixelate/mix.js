import { Interaction, Message } from 'discord.js';
import { BaseInteraction, ButtonInteractionContext, CallbackHandler, Client, DropdownInteractionContext, ModalInteractionContext } from '../..';
export declare class InteractionHandler implements CallbackHandler {
    protected _client: Client;
    private _stopped;
    buttonCallbacks: Map<string, (context: ButtonInteractionContext) => Promise<any>>;
    dropdownCallbacks: Map<string, (context: DropdownInteractionContext) => Promise<any>>;
    modalCallbacks: Map<string, (context: ModalInteractionContext) => Promise<any>>;
    messageCallbacks: ((message: Message) => Promise<any>)[];
    constructor(client: Client);
    stop(): Promise<void>;
    onWSInteractionCreate(interaction: BaseInteraction): Promise<void>;
    onMessageCreate(message: Message): Promise<void>;
    onInteractionCreate(interaction: Interaction): Promise<void | import("discord-api-types").APIMessage | Message<boolean>>;
    get client(): Client;
}
