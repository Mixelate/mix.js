import { Interaction, Message, TextChannel } from 'discord.js';
import { BaseInteraction, ButtonInteractionContext, CallbackHandler, Client, DropdownInteractionContext, InteractionType, ModalInteractionContext } from '../..';

import { ApiBaseInteraction } from '../discord/interactions/api/ApiBaseInteraction';
import { ApiModalSubmitInteraction, IsApiModalInteraction } from '../discord/interactions/api/ApiModalInteraction';
import { ModalSubmitInteraction } from '../discord/interactions/parser/ModalSubmitInteraction';
import { AplikoBuildEmbeds, AplikoEmbedStyle } from '../../util/conversion/AplikoEmbed.ts';
import { SilentCatch, ThrowError } from '../../util/Errors';

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
    public dropdownCallbacks: Map<string, (context: DropdownInteractionContext) => Promise<any>>;
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
        this.dropdownCallbacks = new Map();
        this.modalCallbacks = new Map();

        this._client.on('interactionCreate', this.onInteractionCreate.bind(this))
        this._client.on('wsInteractionCreate', this.onWSInteractionCreate.bind(this))
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
            if (interaction.isButton()) {
                await this.buttonCallbacks.get(interaction.customId)?.apply(this, [
                    <ButtonInteractionContext>{
                        interaction,
                    }
                ]);
            }

            if (interaction.isSelectMenu()) {
                await this.dropdownCallbacks.get(interaction.customId)?.apply(this, [
                    <DropdownInteractionContext>{
                        interaction,
                    }
                ]);
            }
        } catch (error: any) {
            await interaction.deferReply({ ephemeral: true }).catch((_) => { });
            await interaction.editReply({
                embeds: AplikoBuildEmbeds(this.client, {
                    style: AplikoEmbedStyle.ERROR,
                    title: 'An error occurred.',
                    description: error.toString(),
                }),
                components: []
            });
        }
    }

    public async onWSInteractionCreate(interaction: BaseInteraction) {
        if (interaction instanceof ModalSubmitInteraction) {
            const modalSubmitInteraction = interaction as ModalSubmitInteraction;

            if (modalSubmitInteraction.getChannelId() != this.channelId)
                return;

            return new Promise<void>(async (resolve, reject) => {
                try {

                    await this.modalCallbacks.get(interaction.getCustomId())?.apply(this, [
                        <ModalInteractionContext>{
                            interaction: modalSubmitInteraction,
                        }
                    ]);
                } catch (err) {
                    await modalSubmitInteraction.handleError(err);
                }

                resolve();
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
