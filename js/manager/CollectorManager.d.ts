import { GuildMember, Message } from 'discord.js';
import { ButtonCollectionResult, Client, ComponentCollectionKey, ComponentCollectionResult, DropdownCollectionResult, MessageCollectionKey, MessageCollectionResult, ModalCollectionKey, ModalCollectionResult } from '..';
export declare class CollectorManager {
    private awaitingComponent;
    private awaitingMessage;
    private awaitingDropdown;
    private awaitingButton;
    private awaitingModal;
    constructor(client: Client);
    private onMessageCreate;
    private onInteractionCreate;
    private onWSInteractionCreate;
    collectComponent(messageId: string): Promise<ComponentCollectionResult>;
    collectMessage(messageCollectionKey: MessageCollectionKey): Promise<MessageCollectionResult>;
    collectMemberMention(messageCollectionKey: MessageCollectionKey): Promise<GuildMember>;
    collectDropdown(selectionCollectionKey: ComponentCollectionKey): Promise<DropdownCollectionResult>;
    collectButton(componentCollectionKey: ComponentCollectionKey): Promise<ButtonCollectionResult>;
    collectModal(formCollectionKey: ModalCollectionKey): Promise<ModalCollectionResult>;
}
export interface MessageCollector {
    (message: Message | null): Promise<any>;
}
