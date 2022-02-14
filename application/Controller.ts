import { ButtonInteraction, Interaction, Message, SelectMenuInteraction, TextChannel } from 'discord.js'
import { AplikoBot } from '../Bot'
import { CallbackHandler } from '../decorator'
import { CALLBACK_WILDCARD } from '../decorator/DecoratorSymbols'
import { AplikoBuildEmbeds, AplikoEmbedStyle } from '../util/conversion/AplikoEmbed'
import { SilentCatch, ThrowError } from '../util/Errors'
import { ButtonInteractionContext, SelectMenuInteractionContext } from '../struct/apliko/Contexts'
import { FetchComponentInteractionData } from '../struct/apliko/ComponentInteractionData'

export class Controller implements CallbackHandler {

    private _bot: AplikoBot
    private _channelId: string
    private _loaded: boolean
    private _stopped: boolean

    // Callbacks
    public loadCallbacks: (() => Promise<any>)[]
    public stopCallbacks: (() => Promise<any>)[]
    public messageCallbacks: ((message: Message) => Promise<any>)[]
    public buttonCallbacks: Map<string, (context: ButtonInteractionContext) => Promise<any>>
    public selectCallbacks: Map<string, (context: SelectMenuInteractionContext) => Promise<any>>

    public constructor(bot: AplikoBot, channelId: string) {
        this._bot = bot
        this._channelId = channelId
        this._loaded = true
        this._stopped = false

        this.loadCallbacks = []
        this.stopCallbacks = []
        this.messageCallbacks = []
        this.buttonCallbacks = new Map()
        this.selectCallbacks = new Map()
    }

    public async load() {
        if (!(await SilentCatch(this.getChannelInstance.bind(this), this)))
            return this._stopped = true

        this.loadCallbacks.forEach(async loadCallback =>
            await loadCallback.apply(this))
    }

    public async stop() {
        this._stopped = true

        this.stopCallbacks.forEach(async stopCallback =>
            await stopCallback.apply(this))
    }

    public async onInteractionCreate(interaction: Interaction) {
        if (this._stopped) return
        if (!interaction.isMessageComponent()) return

        try {
            const componentInteractionData = await FetchComponentInteractionData(interaction.customId)

            if (interaction.isButton()) {
                await this.buttonCallbacks.get(componentInteractionData.componentId)
                    ?.apply(this, [<ButtonInteractionContext>{
                        interaction,
                        data: componentInteractionData
                    }])
            }

            if (interaction.isSelectMenu()) {
                await this.selectCallbacks.get(componentInteractionData.componentId)
                    ?.apply(this, [<SelectMenuInteractionContext>{
                        interaction,
                        data: componentInteractionData
                    }])
            }
        } catch (error: any) {
            console.log(error)
            await interaction.deferReply({ ephemeral: true }).catch(_ => { })
            await interaction.editReply({
                embeds: AplikoBuildEmbeds({
                    style: AplikoEmbedStyle.ERROR,
                    description: 'An error occurred while processing your interaction.',
                    footer: {
                        content: error.toString()
                    }
                }),
                components: []
            })
        }
    }

    public async onMessageCreate(message: Message) {
        this.messageCallbacks.forEach(messageCallback => messageCallback.apply(this, [message]))
    }

    public async getChannelInstance(): Promise<TextChannel> {
        const apiChannel = await this._bot.client.channels.fetch(this._channelId) ??
            ThrowError('APLIKO_CHANNEL_CONTROLLER_GET_INST_FALSY_API')

        const resolvedChannel = this._bot.client.channels.resolve(apiChannel) ??
            ThrowError('APLIKO_CHANNEL_CONTROLLER_GET_INST_FALSY_RESOLVE')

        if (!(resolvedChannel instanceof TextChannel))
            ThrowError('APLIKO_CHANNEL_CONTROLLER_GET_INST_CAST')

        return resolvedChannel
    }

    public get bot(): AplikoBot {
        return this._bot
    }

    public get channelId(): string {
        return this._channelId
    }

    public get loaded(): boolean {
        return this._loaded
    }

    public get stopped(): boolean {
        return this._stopped
    }

}