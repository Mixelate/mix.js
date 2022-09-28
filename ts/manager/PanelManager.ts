import { Interaction } from 'discord.js';
import { AplikoBuildEmbeds, AplikoEmbedStyle, BaseInteraction, Client, ComponentsToDJS, Embed, PanelButtonInteractionContext, PanelModalInteractionContext, PanelPage, ThrowError } from '..';
import { PanelContext, PanelDropdownInteractionContext } from '../struct/application/panel/PanelContext';
import { ModalSubmitInteraction } from '../struct/discord/interactions/parser/ModalSubmitInteraction';
import { RespondableInteraction } from '../util/discord/DiscordTypes';

export type PanelPageClass = { new(...args: any[]): PanelPage };

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

        new Promise(async (resolve, reject) => {
            if (interaction.isButton()) {
                await context.currentPage.onButton(
                    <PanelButtonInteractionContext>{
                        interaction: interaction,
                        panelContext: context
                    }                );
            }

            if (interaction.isSelectMenu()) {
                await context.currentPage.onSelect(
                    <PanelDropdownInteractionContext>{
                        interaction: interaction,
                        panelContext: context
                    }
                );
            }
        }).catch(err => {
            if (interaction.replied || interaction.deferred) {
                return interaction.editReply({
                    embeds: AplikoBuildEmbeds(this.client, {
                        style: AplikoEmbedStyle.ERROR,
                        description: err.toString()
                    })
                }).catch(_ => { });
            }

            interaction.reply({
                embeds: AplikoBuildEmbeds(this.client, {
                    style: AplikoEmbedStyle.ERROR,
                    description: err.toString()
                })
            }).catch(_ => { })
        })
    }

    public async onWSInteractionCreate(interaction: BaseInteraction) {
        if (interaction instanceof ModalSubmitInteraction) {
            const context = this.panelContextCache.get(interaction.getMessageId()!)!;

            if (!context) return;

            context.currentPage.onModal(
                <PanelModalInteractionContext>{
                    interaction: interaction,
                    panelContext: context
                }
            ).catch(err => {
                if (interaction.didReply || interaction.wasReplyDeferred) {
                    return interaction.editReply({
                        embeds: [{
                            style: AplikoEmbedStyle.ERROR,
                            description: err.toString()
                        }]
                    }).catch(_ => { });
                }

                if (interaction.wasEditDeferred) {
                    // TODO: Edit deferr error handling
                }

                interaction.reply({
                    embeds: [{
                        style: AplikoEmbedStyle.ERROR,
                        description: err.toString()
                    }]
                }).catch(_ => { })
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

        const replyMessage = interaction.deferred
            ? await interaction.fetchReply()
            : await interaction.deferReply({
                ephemeral: true,
                fetchReply: true
            }).catch(() => null);

        if (!replyMessage)
            throw new Error('Failed to fetch interaction reply message? Did you update or defer?')

        const prereqResult = await page.checkPrereqs(interaction);

        if (!prereqResult.success)
            return interaction.editReply({
                embeds: [
                    Embed.new()
                        .danger()
                        .description(prereqResult.message || 'An unknown error occured while opening that menu.')
                        .toJSON()
                ]
            })

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

    public async refreshPage(context: PanelContext, disabled?: boolean) {
        const skeleton = context.currentPage.constructSkeleton(context);

        if (disabled)
            skeleton?.components.forEach(component => component?.disable())

        if (skeleton)
            await context.interaction.editReply({
                files: skeleton.attachments,
                embeds: skeleton.embeds ? AplikoBuildEmbeds(this.client, ...skeleton.embeds) : undefined,
                components: ComponentsToDJS(...skeleton.components)
            }).catch(_ => null)


        let pageContent = await context.currentPage.construct(context, skeleton);

        if (!pageContent && skeleton)
            return;

        if (!pageContent && !skeleton)
            pageContent = PanelPage.defaultPageContent

        if (disabled)
            pageContent?.components.forEach(component => component?.disable())

        await context.interaction.editReply({
            files: pageContent!.attachments,
            embeds: pageContent!.embeds ? AplikoBuildEmbeds(this.client, ...pageContent!.embeds) : undefined,
            components: ComponentsToDJS(...pageContent!.components)
        }).catch(_ => null);


    }

    public registerPage(page: PanelPage) {
        this.panelPageCache.set(Object.getPrototypeOf(page).constructor, page);
    }
}
