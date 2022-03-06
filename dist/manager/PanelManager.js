"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanelManager = void 0;
const ComponentInteractionData_1 = require("../struct/apliko/ComponentInteractionData");
const ModalSubmitInteraction_1 = require("../struct/discord/interactions/parser/ModalSubmitInteraction");
const __1 = require("..");
class PanelManager {
    constructor(bot) {
        this.client = bot;
        this.panelPageCache = new Map();
        this.panelContextCache = new Map();
        this.client.on('interactionCreate', this.onInteractionCreate.bind(this));
        this.client.on('wsInteractionCreate', this.onWSInteractionCreate.bind(this));
    }
    async onInteractionCreate(interaction) {
        if (!interaction.isMessageComponent())
            return;
        if (!this.panelContextCache.has(interaction.message.id))
            return;
        const context = this.panelContextCache.get(interaction.message.id);
        const componentInteractionData = await (0, ComponentInteractionData_1.FetchComponentInteractionData)(interaction.customId);
        if (interaction.isButton()) {
            context.currentPage.onButton({
                interaction: interaction,
                data: componentInteractionData,
                panelContext: context
            }, componentInteractionData);
        }
        if (interaction.isSelectMenu()) {
            context.currentPage.onSelect({
                interaction: interaction,
                data: componentInteractionData,
                panelContext: context
            }, componentInteractionData);
        }
    }
    async onWSInteractionCreate(interaction) {
        if (interaction instanceof ModalSubmitInteraction_1.ModalSubmitInteraction) {
            const context = this.panelContextCache.get(interaction.getMessageId());
            if (!context)
                return;
            const componentInteractionData = await (0, ComponentInteractionData_1.FetchComponentInteractionData)(interaction.getCustomId());
            context.currentPage.onModal({
                interaction: interaction,
                data: componentInteractionData,
                panelContext: context
            }, componentInteractionData);
        }
    }
    async openPanel(interaction, pageClass) {
        const page = this.panelPageCache.get(pageClass) || (0, __1.ThrowError)('Panel page is not cached.');
        const replyMessage = await interaction.deferReply({
            ephemeral: true,
            fetchReply: true
        });
        const context = {
            interaction,
            replyMessageId: replyMessage.id,
            currentPage: page
        };
        this.panelContextCache.set(replyMessage.id, context);
        this.openPage(context, pageClass);
    }
    async openDynamicPanel(interaction, page) {
        const replyMessage = await interaction.deferReply({
            ephemeral: true,
            fetchReply: true
        });
        const context = {
            interaction,
            replyMessageId: replyMessage.id,
            currentPage: page
        };
        this.panelContextCache.set(replyMessage.id, context);
        this.openDynamicPage(context, page);
    }
    async openDynamicPage(context, page) {
        context.currentPage = page;
        await this.refreshPage(context);
    }
    async openPage(context, pageClass) {
        const page = this.panelPageCache.get(pageClass) || (0, __1.ThrowError)('Panel page is not cached.');
        context.currentPage = page;
        await this.refreshPage(context);
    }
    async refreshPage(context) {
        const pageContent = await context.currentPage.constructPage(context);
        await context.interaction.editReply({
            embeds: (0, __1.AplikoBuildEmbeds)(this.client, ...pageContent.embeds),
            components: (0, __1.ComponentsToDJS)(...pageContent.components)
        });
    }
    registerPage(page) {
        this.panelPageCache.set(Object.getPrototypeOf(page).constructor, page);
    }
}
exports.PanelManager = PanelManager;
