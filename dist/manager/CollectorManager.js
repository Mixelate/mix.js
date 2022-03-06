"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectorManager = void 0;
const __1 = require("..");
// TODO: Rewrite this son of a bitch
class CollectorManager {
    constructor(client) {
        this.awaitingMessage = new Map();
        this.awaitingDropdown = new Map();
        this.awaitingButton = new Map();
        this.awaitingModal = new Map();
        client.on('messageCreate', this.onMessageCreate.bind(this));
        client.on('interactionCreate', this.onInteractionCreate.bind(this));
        client.on('wsInteractionCreate', this.onWSInteractionCreate.bind(this));
    }
    async onMessageCreate(message) {
        this.awaitingMessage.forEach((deferredMessage, messageCollectionKey) => {
            if (message.member != messageCollectionKey.userResolvable)
                return;
            if (message.channel != messageCollectionKey.channelResolvable)
                return;
            deferredMessage.resolve?.({ message });
            (0, __1.SafeDeleteMessage)(message);
            this.awaitingMessage.delete(messageCollectionKey);
        });
    }
    async onInteractionCreate(interaction) {
        if (interaction.isSelectMenu()) {
            this.awaitingDropdown.forEach((deferredSelection, componentCollectionKey) => {
                if (componentCollectionKey.guildMemberResolvable && interaction.member != componentCollectionKey.guildMemberResolvable)
                    return;
                if (interaction.message != componentCollectionKey.messageResolvable)
                    return;
                if (interaction.customId != componentCollectionKey.componentId)
                    return;
                deferredSelection.resolve({
                    value: interaction.values[0],
                    interaction: interaction
                });
                this.awaitingDropdown.delete(componentCollectionKey);
            });
        }
        if (interaction.isButton()) {
            this.awaitingButton.forEach((deferredSelection, componentCollectionKey) => {
                if (componentCollectionKey.guildMemberResolvable && interaction.member != componentCollectionKey.guildMemberResolvable)
                    return;
                if (interaction.message != componentCollectionKey.messageResolvable)
                    return;
                if (interaction.customId != componentCollectionKey.componentId)
                    return;
                deferredSelection.resolve({
                    value: interaction.customId,
                    interaction: interaction
                });
                this.awaitingButton.delete(componentCollectionKey);
            });
        }
    }
    async onWSInteractionCreate(interaction) {
        if (interaction instanceof __1.ModalSubmitInteraction) {
            this.awaitingModal.forEach(async (deferred, formCollectionKey) => {
                if (interaction.getUserId() != formCollectionKey.userId)
                    return;
                if (interaction.getChannelId() != formCollectionKey.channelId)
                    return;
                deferred.resolve?.({
                    responses: interaction.getValues(),
                    interaction: interaction
                });
                this.awaitingModal.delete(formCollectionKey);
            });
        }
    }
    async collectMessage(messageCollectionKey) {
        let deferred = (0, __1.defer)();
        this.awaitingMessage.get(messageCollectionKey)?.reject?.("You started another interaction before finishing this one so it's been terminated.");
        this.awaitingMessage.set(messageCollectionKey, deferred);
        return deferred.promise;
    }
    async collectMemberMention(messageCollectionKey) {
        let deferredMessage = (0, __1.defer)();
        this.awaitingMessage.get(messageCollectionKey)?.reject?.("You started another interaction before finishing this one so it's been terminated.");
        this.awaitingMessage.set(messageCollectionKey, deferredMessage);
        const result = await deferredMessage.promise;
        const userId = (0, __1.getUserIdFromMention)(result.message.content) || (0, __1.ThrowError)('Make sure your message only contains a member mention');
        const resolvedMember = result.message.guild.members.resolve(userId) || (0, __1.ThrowError)('Failed to find the mentioned member');
        return resolvedMember;
    }
    async collectDropdown(selectionCollectionKey) {
        let deferred = (0, __1.defer)();
        this.awaitingDropdown.get(selectionCollectionKey)?.reject?.("You started another interaction before finishing this one so it's been terminated.");
        this.awaitingDropdown.set(selectionCollectionKey, deferred);
        return deferred.promise;
    }
    async collectButton(componentCollectionKey) {
        let deferred = (0, __1.defer)();
        this.awaitingButton.get(componentCollectionKey)?.reject?.("You started another interaction before finishing this one so it's been terminated.");
        this.awaitingButton.set(componentCollectionKey, deferred);
        return deferred.promise;
    }
    async collectModal(formCollectionKey) {
        let deferred = (0, __1.defer)();
        this.awaitingModal.get(formCollectionKey)?.reject?.("You started another interaction before finishing this one so it's been terminated.");
        this.awaitingModal.set(formCollectionKey, deferred);
        return deferred.promise;
    }
}
exports.CollectorManager = CollectorManager;
