import { Interaction } from 'discord.js';
import { AplikoEmbedStyle, BaseInteraction, Client, PanelButtonInteractionContext, PanelModalInteractionContext, PanelPage } from '..';
import { FetchComponentInteractionData } from '../util/ComponentInteractionData';
import { ApiBaseInteraction, ApiModalSubmitInteraction, IsApiModalInteraction } from '..';
import { ModalSubmitInteraction } from '../struct/discord/interactions/parser/ModalSubmitInteraction';
import { AplikoBuildComponentRows, AplikoBuildEmbeds, ComponentsToDJS, RepliableInteraction, ThrowError } from '..';
import { RespondableInteraction } from '../util/discord/DiscordTypes';
import { PanelContext, PanelDropdownInteractionContext } from '../struct/application/panel/PanelContext';

export type PanelPageClass = { new (...args: any[]): PanelPage };

export class PanelManager {
    private client: Client;

    private panelPageCache: Map<PanelPageClass, PanelPage>;
    private panelContextCache: Map<string, PanelContext>;

    constructor(bot: Client) {
        this.client = bot;
        this.panelPageCache = new Map();
        this.panelContextCache = new Map();
        this.client.on('interactionCreate', this.onInteractionCreate.bind(this));
        this.client.on('wsInteractionCreate', this.onWSInteractionCreate.bind(this));
    }

    public async onInteractionCreate(interaction: Interaction) {
        if (!interaction.isMessageComponent()) return;
        if (!this.panelContextCache.has(interaction.message.id)) return;

        const context = this.panelContextCache.get(interaction.message.id)!;
        const componentInteractionData = await FetchComponentInteractionData(interaction.customId);

        new Promise(async (resolve, reject) => {
            if (interaction.isButton()) {
                await context.currentPage.onButton(
                    <PanelButtonInteractionContext>{
                        interaction: interaction,
                        data: componentInteractionData,
                        panelContext: context
                    },
                    componentInteractionData
                );
            }
    
            if (interaction.isSelectMenu()) {
                await context.currentPage.onSelect(
                    <PanelDropdownInteractionContext>{
                        interaction: interaction,
                        data: componentInteractionData,
                        panelContext: context
                    },
                    componentInteractionData
                );
            }
        }).catch(err => {
            if (interaction.replied || interaction.deferred) {
                return interaction.editReply({
                    embeds: AplikoBuildEmbeds(this.client, {
                        style: AplikoEmbedStyle.ERROR,
                        description: err.toString()
                    })
                }).catch(_ => {});
            }

            interaction.reply({
                embeds: AplikoBuildEmbeds(this.client, {
                    style: AplikoEmbedStyle.ERROR,
                    description: err.toString()
                })
            }).catch(_ => {})
        })
    }

    public async onWSInteractionCreate(interaction: BaseInteraction) {
        if (interaction instanceof ModalSubmitInteraction) {
            const context = this.panelContextCache.get(interaction.getMessageId()!)!;

            if (!context) return;

            const componentInteractionData = await FetchComponentInteractionData(interaction.getCustomId());

            context.currentPage.onModal(
                <PanelModalInteractionContext>{
                    interaction: interaction,
                    data: componentInteractionData,
                    panelContext: context
                },
                componentInteractionData
            ).catch(err => {
                if (interaction.didReply || interaction.wasReplyDeferred) {
                    return interaction.editReply({
                        embeds: [{
                            style: AplikoEmbedStyle.ERROR,
                            description: err.toString()
                        }]
                    }).catch(_ => {});
                }

                if (interaction.wasEditDeferred) {
                    // TODO: Edit deferr error handling
                }
    
                interaction.reply({
                    embeds: [{
                        style: AplikoEmbedStyle.ERROR,
                        description: err.toString()
                    }]
                }).catch(_ => {})
            });
        }
    }

    public async openPanel(interaction: RespondableInteraction, pageClass: PanelPageClass) {
        const page = this.panelPageCache.get(pageClass) || ThrowError('Panel page is not cached.');

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

    public async openDynamicPanel(interaction: RespondableInteraction, page: PanelPage) {
        if (interaction.deferred && !interaction.ephemeral)
            throw new Error('Attempting to use a non-ephemeral interaction for a panel.')

        const replyMessage = interaction.deferred ? await interaction.fetchReply() : await interaction.deferReply({
            ephemeral: true,
            fetchReply: true
        }).catch(() => null);

        if (!replyMessage)
            return;

        const context = {
            interaction,
            replyMessageId: replyMessage.id,
            currentPage: page
        };

        this.panelContextCache.set(replyMessage.id, context);
        this.openDynamicPage(context, page);
    }

    public async openDynamicPage(context: PanelContext, page: PanelPage) {
        context.currentPage = page;
        await this.refreshPage(context);
    }

    public async openPage(context: PanelContext, pageClass: PanelPageClass) {
        const page = this.panelPageCache.get(pageClass) || ThrowError('Panel page is not cached.');

        context.currentPage = page;
        await this.refreshPage(context);
    }

    public async refreshPage(context: PanelContext) {
        const pageContent = await context.currentPage.constructPage(context);

        await context.interaction.editReply({
            files: pageContent.attachments,
            embeds: pageContent.embeds ? AplikoBuildEmbeds(this.client, ...pageContent.embeds) : undefined,
            components: ComponentsToDJS(...pageContent.components)
        }).catch((a) => null);
    }

    public registerPage(page: PanelPage) {
        this.panelPageCache.set(Object.getPrototypeOf(page).constructor, page);
    }
}
