import { GuildMember, Interaction, Message, MessageResolvable } from 'discord.js';
import {
    BaseInteraction,
    ButtonCollectionResult,
    Client,
    ComponentCollectionKey,
    ComponentCollectionKeyV2,
    ComponentCollectionResult,
    defer,
    Deferred,
    DropdownCollectionResult,
    getUserIdFromMention,
    MessageCollectionKey,
    MessageCollectionResult,
    ModalCollectionKey,
    ModalCollectionResult,
    ModalSubmitInteraction,
    SafeDeleteMessage,
    ThrowError,
} from '..';

// TODO: Rewrite this son of a bitch
export class CollectorManager {

    private awaitingComponent: Map<string, Deferred<ComponentCollectionResult>> = new Map();
    private awaitingMessage: Map<MessageCollectionKey, Deferred<MessageCollectionResult>> = new Map();
    private awaitingDropdown: Map<ComponentCollectionKey, Deferred<DropdownCollectionResult>> = new Map();
    private awaitingButton: Map<ComponentCollectionKey, Deferred<ButtonCollectionResult>> = new Map();
    private awaitingModal: Map<ModalCollectionKey, Deferred<ModalCollectionResult>> = new Map();

    constructor(client: Client) {
        client.on('messageCreate', this.onMessageCreate.bind(this));
        client.on('interactionCreate', this.onInteractionCreate.bind(this));
        client.on('wsInteractionCreate', this.onWSInteractionCreate.bind(this));
    }

    private async onMessageCreate(message: Message) {
        this.awaitingMessage.forEach((deferredMessage, messageCollectionKey) => {
            if (message.member != messageCollectionKey.userResolvable) return;
            if (message.channel != messageCollectionKey.channelResolvable) return;
            deferredMessage.resolve?.({ message });
            SafeDeleteMessage(message);
            this.awaitingMessage.delete(messageCollectionKey);
        });
    }

    private async onInteractionCreate(interaction: Interaction) {
        if (!interaction.isSelectMenu() && !interaction.isButton())
            return;

        this.awaitingComponent.get(interaction.message.id)?.resolve?.({
            value: interaction.isSelectMenu()
                ? interaction.values[0]
                : interaction.customId,
            interaction: interaction
        })

        if (interaction.isSelectMenu()) {
            this.awaitingDropdown.forEach(async (deferredSelection, componentCollectionKey) => {
                if (componentCollectionKey.guildMemberResolvable && interaction.member != componentCollectionKey.guildMemberResolvable) return;
                if (interaction.message != componentCollectionKey.messageResolvable) return;
                if (interaction.customId != componentCollectionKey.componentId) return;

                deferredSelection.resolve!({
                    value: interaction.values[0],
                    interaction: interaction
                });
                this.awaitingDropdown.delete(componentCollectionKey);
            });
        }

        if (interaction.isButton()) {
            this.awaitingButton.forEach(async (deferredSelection, componentCollectionKey) => {
                if (componentCollectionKey.guildMemberResolvable && interaction.member != componentCollectionKey.guildMemberResolvable) return;
                if (interaction.message != componentCollectionKey.messageResolvable) return;
                if (interaction.customId != componentCollectionKey.componentId) return;

                deferredSelection.resolve!({
                    id: interaction.customId,
                    interaction: interaction
                });
                this.awaitingButton.delete(componentCollectionKey);
            });
        }
    }

    private async onWSInteractionCreate(interaction: BaseInteraction) {
        if (interaction instanceof ModalSubmitInteraction) {
            this.awaitingModal.forEach(async (deferred, formCollectionKey) => {
                if (interaction.getUserId() != formCollectionKey.userId) return;
                if (interaction.getChannelId() != formCollectionKey.channelId) return;

                deferred.resolve?.({
                    responses: interaction.getValues(),
                    interaction: interaction
                });
                this.awaitingModal.delete(formCollectionKey);
            });
        }
    }

    public async collectComponent(messageId: string): Promise<ComponentCollectionResult> {
        let deferred = defer<ComponentCollectionResult>();
        this.awaitingComponent.get(messageId)?.reject?.('Session expired.');
        this.awaitingComponent.set(messageId, deferred);
        return deferred.promise!;
    }

    public async collectMessage(messageCollectionKey: MessageCollectionKey): Promise<MessageCollectionResult> {
        let deferred = defer<MessageCollectionResult>();
        this.awaitingMessage.get(messageCollectionKey)?.reject?.("You started another interaction before finishing this one so it's been terminated.");
        this.awaitingMessage.set(messageCollectionKey, deferred);
        return deferred.promise!;
    }

    public async collectMemberMention(messageCollectionKey: MessageCollectionKey): Promise<GuildMember> {
        let deferredMessage = defer<MessageCollectionResult>();
        this.awaitingMessage.get(messageCollectionKey)?.reject?.("You started another interaction before finishing this one so it's been terminated.");
        this.awaitingMessage.set(messageCollectionKey, deferredMessage);
        const result = await deferredMessage.promise!;
        const userId = getUserIdFromMention(result.message.content) || ThrowError('Make sure your message only contains a member mention');
        const resolvedMember = result.message.guild!.members.resolve(userId) || ThrowError('Failed to find the mentioned member');
        return resolvedMember;
    }

    public async collectDropdown(selectionCollectionKey: ComponentCollectionKey): Promise<DropdownCollectionResult> {
        let deferred = defer<DropdownCollectionResult>();
        this.awaitingDropdown.get(selectionCollectionKey)?.reject?.("You started another interaction before finishing this one so it's been terminated.");
        this.awaitingDropdown.set(selectionCollectionKey, deferred);
        return deferred.promise!;
    }

    public async collectButton(componentCollectionKey: ComponentCollectionKey): Promise<ButtonCollectionResult> {
        let deferred = defer<ButtonCollectionResult>();
        this.awaitingButton.get(componentCollectionKey)?.reject?.("You started another interaction before finishing this one so it's been terminated.");
        this.awaitingButton.set(componentCollectionKey, deferred);
        return deferred.promise!;
    }

    public async collectModal(formCollectionKey: ModalCollectionKey): Promise<ModalCollectionResult> {
        let deferred = defer<ModalCollectionResult>();
        this.awaitingModal.get(formCollectionKey)?.reject?.("You started another interaction before finishing this one so it's been terminated.");
        this.awaitingModal.set(formCollectionKey, deferred);
        return deferred.promise!;
    }
}

export interface MessageCollector {
    (message: Message | null): Promise<any>;
}
