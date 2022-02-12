import { Interaction } from "discord.js";
import { PanelContext, PanelPage } from "../application/panel";
import { AplikoBot } from "../Bot";
import { FetchComponentInteractionData } from "../struct/apliko/ComponentInteractionData";
import { AplikoBuildComponentRows, AplikoBuildEmbeds, RepliableInteraction, ThrowError } from "../util";

export type PanelPageClass =  { new (...args: any[]): PanelPage }

export class PanelManager {

    private _bot: AplikoBot

    private _panelPageCache: Map<PanelPageClass, PanelPage>
    private _panelContextCache: Map<string, PanelContext>

    constructor (bot: AplikoBot) {
        this._bot = bot
        this._panelPageCache = new Map()
        this._panelContextCache = new Map()
        this._bot.client.on('interactionCreate', this.onInteractionCreate.bind(this))
    }

    public async onInteractionCreate(interaction: Interaction) {
        if (!interaction.isMessageComponent()) return
        if (!this._panelContextCache.has(interaction.message.id)) return

        const context = this._panelContextCache.get(interaction.message.id)!
        const componentInteractionData = await FetchComponentInteractionData(interaction.customId)

        if (interaction.isButton()) {
            interaction.deferUpdate()
            context.currentPage.onButton(context, componentInteractionData)
        }

        if (interaction.isSelectMenu()) {
            interaction.deferUpdate()
            context.currentPage.onSelect(context, componentInteractionData)
        }
    }

    public async openPanel(interaction: RepliableInteraction, pageClass: PanelPageClass) {
        const page = this._panelPageCache.get(pageClass) ||
            ThrowError('Panel page is not cached.')

        const replyMessage = await interaction.deferReply({ ephemeral: true, fetchReply: true })
        const context = {
            interaction,
            replyMessageId: replyMessage.id,
            currentPage: page,
        }

        this._panelContextCache.set(replyMessage.id, context)
        this.openPage(context, pageClass)
    }

    public async openDynamicPage(context: PanelContext, page: PanelPage) {
        context.currentPage = page

        await context.interaction.editReply({
            embeds: AplikoBuildEmbeds(...page.embeds),
            components: AplikoBuildComponentRows(...page.components)
        })
    }

    public async openPage(context: PanelContext, pageClass: PanelPageClass) {
        const page = this._panelPageCache.get(pageClass) ||
            ThrowError('Panel page is not cached.')

        context.currentPage = page

        await context.interaction.editReply({
            embeds: AplikoBuildEmbeds(...page.embeds),
            components: AplikoBuildComponentRows(...page.components)
        })
    }

    public registerPage(page: PanelPage) {
        this._panelPageCache.set(Object.getPrototypeOf(page).constructor, page)
    }

}