import { GuildMember, GuildMemberResolvable, Interaction, Message } from "discord.js";
import { AplikoBot } from "../Bot";
import { ComponentCollectionKey } from "../struct/apliko/collector/ComponentCollectionKey";
import { MessageCollectionKey } from "../struct/apliko/collector/MessageCollectionKey";
import { SafeDeleteMessage } from "../util";
import { defer, Deferred } from "../util/Defer";
import { getUserIdFromMention } from "../util/discord/MentionParser";
import { ThrowError } from "../util/Errors";

export class CollectorManager {

    private _awaitingMessage: Map<MessageCollectionKey, Deferred<Message>> = new Map()
    private _awaitingSelection: Map<ComponentCollectionKey, Deferred<string[]>> = new Map()
    private _awaitingButton: Map<ComponentCollectionKey, Deferred<string>> = new Map()

    constructor(bot: AplikoBot) {
        bot.client.on('messageCreate', this.onMessageCreate.bind(this))
        bot.client.on('interactionCreate', this.onInteractionCreate.bind(this))
    }

    private async onMessageCreate(message: Message) {
        this._awaitingMessage.forEach((deferredMessage, messageCollectionKey) => {
            if (message.member != messageCollectionKey.userResolvable) return
            if (message.channel != messageCollectionKey.channelResolvable) return

            // Call the message collector
            deferredMessage.resolve?.(message)

            SafeDeleteMessage(message)

            // Delete it from the awaiting map
            this._awaitingMessage.delete(messageCollectionKey)
        })
    }

    private async onInteractionCreate(interaction: Interaction) {
        if (interaction.isSelectMenu()) {
            this._awaitingSelection.forEach((deferredSelection, componentCollectionKey) => {
                if (interaction.member != componentCollectionKey.guildMemberResolvable) return
                if (interaction.message != componentCollectionKey.messageResolvable) return 
                if (interaction.customId != componentCollectionKey.componentId) return

                interaction.deferUpdate().catch(() => null)
                deferredSelection.resolve!(interaction.values)
                this._awaitingSelection.delete(componentCollectionKey)
            })
        }

        if (interaction.isButton()) {
            this._awaitingButton.forEach((deferredButton, componentCollectionKey) => {
                if (interaction.member != componentCollectionKey.guildMemberResolvable) return
                if (interaction.message != componentCollectionKey.messageResolvable) return 
                if (interaction.customId != componentCollectionKey.componentId) return

                interaction.deferUpdate().catch(() => null)
                deferredButton.resolve!(interaction.customId)
                this._awaitingButton.delete(componentCollectionKey)
            })
        }
    }

    public async collectMessage(messageCollectionKey: MessageCollectionKey): Promise<Message> {
        let deferredMessage = defer<Message>()
        
        this._awaitingMessage.get(messageCollectionKey)?.reject?.('You started another interaction before finishing this one so it\'s been terminated.')
        this._awaitingMessage.set(messageCollectionKey, deferredMessage)

        return deferredMessage.promise!
    }

    public async collectMemberMention(messageCollectionKey: MessageCollectionKey): Promise<GuildMember> {
        let deferredMessage = defer<Message>()
        
        this._awaitingMessage.get(messageCollectionKey)?.reject?.('You started another interaction before finishing this one so it\'s been terminated.')
        this._awaitingMessage.set(messageCollectionKey, deferredMessage)

        const message = await deferredMessage.promise!
        const userId = await getUserIdFromMention(message.content) || ThrowError('Make sure your message only contains a member mention')
        const resolvedMember = message.guild!.members.resolve(userId) || ThrowError('Failed to find the mentioned member')
        return resolvedMember
    }

    public async collectSelection(selectionCollectionKey: ComponentCollectionKey): Promise<string[]> {
        let deferredSelection = defer<string[]>()

        this._awaitingSelection.get(selectionCollectionKey)?.reject?.('You started another interaction before finishing this one so it\'s been terminated.')
        this._awaitingSelection.set(selectionCollectionKey, deferredSelection)

        return deferredSelection.promise!
    }

    public async collectButton(componentCollectionKey: ComponentCollectionKey): Promise<string> {
        let deferredButton = defer<string>()

        this._awaitingButton.get(componentCollectionKey)?.reject?.('You started another interaction before finishing this one so it\'s been terminated.')
        this._awaitingButton.set(componentCollectionKey, deferredButton)

        return deferredButton.promise!
    }

}

export interface MessageCollector {
    (message: Message | null): Promise<any>
}