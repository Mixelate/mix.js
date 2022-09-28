import { Interaction, Message, TextChannel } from 'discord.js';
import { BaseInteraction, ButtonInteractionContext, CallbackHandler, Client, DropdownInteractionContext, ModalInteractionContext } from '../..';
export declare class Controller implements CallbackHandler {
    private _client;
    private _channelId;
    private _loaded;
    private _stopped;
    loadCallbacks: (() => Promise<any>)[];
    stopCallbacks: (() => Promise<any>)[];
    messageCallbacks: ((message: Message) => Promise<any>)[];
    buttonCallbacks: Map<string, (context: ButtonInteractionContext) => Promise<any>>;
    dropdownCallbacks: Map<string, (context: DropdownInteractionContext) => Promise<any>>;
    modalCallbacks: Map<string, (context: ModalInteractionContext) => Promise<any>>;
    constructor(client: Client, channelId: string);
    load(): Promise<true | undefined>;
    stop(): Promise<void>;
    onInteractionCreate(interaction: Interaction): Promise<void>;
    onWSInteractionCreate(interaction: BaseInteraction): Promise<void>;
    onMessageCreate(message: Message): Promise<void>;
    getChannelInstance(): Promise<TextChannel>;
    get client(): Client;
    get channelId(): string;
    get loaded(): boolean;
    get stopped(): boolean;
}
