import { Interaction, Message, TextChannel } from 'discord.js';
import { CallbackHandler, Client, InteractionType } from '..';

import { FetchComponentInteractionData } from '../struct/apliko/ComponentInteractionData';
import { ButtonInteractionContext, ModalInteractionContext, SelectMenuInteractionContext } from '../struct/apliko/Contexts';
import { ApiBaseInteraction } from '../struct/discord/interactions/api/ApiBaseInteraction';
import { ApiModalSubmitInteraction, IsApiModalInteraction } from '../struct/discord/interactions/api/ApiModalInteraction';
import { ModalSubmitInteraction } from '../struct/discord/interactions/parser/ModalSubmitInteraction';
import { AplikoBuildEmbeds, AplikoEmbedStyle } from '../util/conversion/AplikoEmbed.ts';
import { SilentCatch, ThrowError } from '../util/Errors';

export class Controller implements CallbackHandler {
    private _client: Client;
    private _channelId: string;
    private _loaded: boolean;
    private _stopped: boolean;

    // Callbacks
    public loadCallbacks: (() => Promise<any>)[];
    public stopCallbacks: (() => Promise<any>)[];
    public messageCallbacks: ((message: Message) => Promise<any>)[];
    public buttonCallbacks: Map<string, (context: ButtonInteractionContext) => Promise<any>>;
    public selectCallbacks: Map<string, (context: SelectMenuInteractionContext) => Promise<any>>;
    public modalCallbacks: Map<string, (context: ModalInteractionContext) => Promise<any>>;

    public constructor(client: Client, channelId: string) {
        this._client = client;
        this._channelId = channelId;
        this._loaded = true;
        this._stopped = false;

        this.loadCallbacks = [];
        this.stopCallbacks = [];
        this.messageCallbacks = [];
        this.buttonCallbacks = new Map();
        this.selectCallbacks = new Map();
        this.modalCallbacks = new Map();

        client.on('interactionCreate', (interaction: ApiBaseInteraction<InteractionType>) => {
            if (IsApiModalInteraction(interaction)) {
                const modalSubmitInteraction = new ModalSubmitInteraction(client, interaction as ApiModalSubmitInteraction);

                if (interaction.channel_id != this.channelId) return;

                return new Promise<void>(async (resolve, reject) => {
                    try {
                        const componentInteractionData = await FetchComponentInteractionData(modalSubmitInteraction.getCustomId());

                        await this.modalCallbacks.get(componentInteractionData.componentId)?.apply(this, [
                            <ModalInteractionContext>{
                                interaction: modalSubmitInteraction,
                                data: componentInteractionData
                            }
                        ]);
                    } catch (err) {
                        await modalSubmitInteraction.handleError(err);
                    }

                    resolve();
                });
            }
        });
    }

    public async load() {
        if (!(await SilentCatch(this.getChannelInstance.bind(this), this))) return (this._stopped = true);

        this.loadCallbacks.forEach(async (loadCallback) => await loadCallback.apply(this));
    }

    public async stop() {
        this._stopped = true;

        this.stopCallbacks.forEach(async (stopCallback) => await stopCallback.apply(this));
    }

    public async onInteractionCreate(interaction: Interaction) {
        if (this._stopped) return;
        if (!interaction.isMessageComponent()) return;

        try {
            const componentInteractionData = await FetchComponentInteractionData(interaction.customId);

            if (interaction.isButton()) {
                await this.buttonCallbacks.get(componentInteractionData.componentId)?.apply(this, [
                    <ButtonInteractionContext>{
                        interaction,
                        data: componentInteractionData
                    }
                ]);
            }

            if (interaction.isSelectMenu()) {
                await this.selectCallbacks.get(componentInteractionData.componentId)?.apply(this, [
                    <SelectMenuInteractionContext>{
                        interaction,
                        data: componentInteractionData
                    }
                ]);
            }
        } catch (error: any) {
            await interaction.deferReply({ ephemeral: true }).catch((_) => {});
            await interaction.editReply({
                embeds: AplikoBuildEmbeds(this.client, {
                    style: AplikoEmbedStyle.ERROR,
                    description: 'An error occurred while processing your interaction.',
                    footer: {
                        content: error.toString()
                    }
                }),
                components: []
            });
        }
    }

    public async onMessageCreate(message: Message) {
        this.messageCallbacks.forEach((messageCallback) => messageCallback.apply(this, [message]));
    }

    public async getChannelInstance(): Promise<TextChannel> {
        const apiChannel = (await this._client.discordClient.channels.fetch(this._channelId)) ?? ThrowError('APLIKO_CHANNEL_CONTROLLER_GET_INST_FALSY_API');

        const resolvedChannel = this._client.discordClient.channels.resolve(apiChannel) ?? ThrowError('APLIKO_CHANNEL_CONTROLLER_GET_INST_FALSY_RESOLVE');

        if (!(resolvedChannel instanceof TextChannel)) ThrowError('APLIKO_CHANNEL_CONTROLLER_GET_INST_CAST');

        return resolvedChannel;
    }

    public get client(): Client {
        return this._client;
    }

    public get channelId(): string {
        return this._channelId;
    }

    public get loaded(): boolean {
        return this._loaded;
    }

    public get stopped(): boolean {
        return this._stopped;
    }
}
