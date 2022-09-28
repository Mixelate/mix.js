"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanelManager = void 0;
const __1 = require("..");
const ModalSubmitInteraction_1 = require("../struct/discord/interactions/parser/ModalSubmitInteraction");
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
        new Promise(async (resolve, reject) => {
            if (interaction.isButton()) {
                await context.currentPage.onButton({
                    interaction: interaction,
                    panelContext: context
                });
            }
            if (interaction.isSelectMenu()) {
                await context.currentPage.onSelect({
                    interaction: interaction,
                    panelContext: context
                });
            }
        }).catch(err => {
            if (interaction.replied || interaction.deferred) {
                return interaction.editReply({
                    embeds: (0, __1.AplikoBuildEmbeds)(this.client, {
                        style: __1.AplikoEmbedStyle.ERROR,
                        description: err.toString()
                    })
                }).catch(_ => { });
            }
            interaction.reply({
                embeds: (0, __1.AplikoBuildEmbeds)(this.client, {
                    style: __1.AplikoEmbedStyle.ERROR,
                    description: err.toString()
                })
            }).catch(_ => { });
        });
    }
    async onWSInteractionCreate(interaction) {
        if (interaction instanceof ModalSubmitInteraction_1.ModalSubmitInteraction) {
            const context = this.panelContextCache.get(interaction.getMessageId());
            if (!context)
                return;
            context.currentPage.onModal({
                interaction: interaction,
                panelContext: context
            }).catch(err => {
                if (interaction.didReply || interaction.wasReplyDeferred) {
                    return interaction.editReply({
                        embeds: [{
                                style: __1.AplikoEmbedStyle.ERROR,
                                description: err.toString()
                            }]
                    }).catch(_ => { });
                }
                if (interaction.wasEditDeferred) {
                    // TODO: Edit deferr error handling
                }
                interaction.reply({
                    embeds: [{
                            style: __1.AplikoEmbedStyle.ERROR,
                            description: err.toString()
                        }]
                }).catch(_ => { });
            });
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
        if (interaction.deferred && !interaction.ephemeral)
            throw new Error('Attempting to use a non-ephemeral interaction for a panel.');
        const replyMessage = interaction.deferred
            ? await interaction.fetchReply()
            : await interaction.deferReply({
                ephemeral: true,
                fetchReply: true
            }).catch(() => null);
        if (!replyMessage)
            throw new Error('Failed to fetch interaction reply message? Did you update or defer?');
        const prereqResult = await page.checkPrereqs(interaction);
        if (!prereqResult.success)
            return interaction.editReply({
                embeds: [
                    __1.Embed.new()
                        .danger()
                        .description(prereqResult.message || 'An unknown error occured while opening that menu.')
                        .toJSON()
                ]
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
    async refreshPage(context, disabled) {
        const skeleton = context.currentPage.constructSkeleton(context);
        if (disabled)
            skeleton?.components.forEach(component => component?.disable());
        if (skeleton)
            await context.interaction.editReply({
                files: skeleton.attachments,
                embeds: skeleton.embeds ? (0, __1.AplikoBuildEmbeds)(this.client, ...skeleton.embeds) : undefined,
                components: (0, __1.ComponentsToDJS)(...skeleton.components)
            }).catch(_ => null);
        let pageContent = await context.currentPage.construct(context, skeleton);
        if (!pageContent && skeleton)
            return;
        if (!pageContent && !skeleton)
            pageContent = __1.PanelPage.defaultPageContent;
        if (disabled)
            pageContent?.components.forEach(component => component?.disable());
        await context.interaction.editReply({
            files: pageContent.attachments,
            embeds: pageContent.embeds ? (0, __1.AplikoBuildEmbeds)(this.client, ...pageContent.embeds) : undefined,
            components: (0, __1.ComponentsToDJS)(...pageContent.components)
        }).catch(_ => null);
    }
    registerPage(page) {
        this.panelPageCache.set(Object.getPrototypeOf(page).constructor, page);
    }
}
exports.PanelManager = PanelManager;
