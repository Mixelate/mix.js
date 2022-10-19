import { Interaction, Message, TextChannel } from 'discord.js';

import { BaseInteraction, ButtonInteractionContext, CallbackHandler, Client, DropdownInteractionContext, ModalInteractionContext } from '../..';
import { AplikoBuildEmbeds, AplikoEmbedStyle } from '../../util/conversion/AplikoEmbed.ts';
import { ModalSubmitInteraction } from '../discord/interactions/parser/ModalSubmitInteraction';

export class InteractionHandler implements CallbackHandler {
    protected _client: Client;
    private _stopped: boolean;

    // Callbacks
    public buttonCallbacks: Map<string, (context: ButtonInteractionContext) => Promise<any>>;
    public dropdownCallbacks: Map<string, (context: DropdownInteractionContext) => Promise<any>>;
    public modalCallbacks: Map<string, (context: ModalInteractionContext) => Promise<any>>;

    public messageCallbacks: ((message: Message) => Promise<any>)[];

    public constructor(client: Client) {
        this._client = client;
        this._stopped = false;
        this.buttonCallbacks = new Map();
        this.dropdownCallbacks = new Map();
        this.modalCallbacks = new Map();
        this.messageCallbacks = [];
        this._client.on('interactionCreate', this.onInteractionCreate.bind(this));
        this._client.on('messageCreate', this.onMessageCreate.bind(this));
        this._client.on('wsInteractionCreate', this.onWSInteractionCreate.bind(this))
    }

    public async stop() {
        this._stopped = true;
    }

    public async onWSInteractionCreate(interaction: BaseInteraction) {
        if (interaction instanceof ModalSubmitInteraction) {
            return new Promise<void>(async (resolve, reject) => {
                try {

                    await this.modalCallbacks.get(interaction.getCustomId())?.apply(this, [
                        <ModalInteractionContext>{
                            interaction: interaction,
                        }
                    ]);
                } catch (err) {
                    await interaction.handleError(err);
                }

                resolve();
            });
        }
    }

    public async onMessageCreate(message: Message) {
        for (const callback of this.messageCallbacks) {
            callback.apply(this, [message]);
        }
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
            if (!error) return console.log(error);

            if (interaction.deferred)
                return await interaction.editReply({
                    embeds: AplikoBuildEmbeds(this.client, {
                        style: AplikoEmbedStyle.ERROR,
                        title: 'An error occurred.',
                        description: error.toString(),
                    }),
                    components: [],
                    files: []
                }).catch(async _ => {
                    await interaction.channel?.messages.resolve(interaction.message.id)?.edit({
                        embeds: AplikoBuildEmbeds(this.client, {
                            style: AplikoEmbedStyle.ERROR,
                            title: 'An error occurred.',
                            description: error.toString(),
                        }),
                        components: [],
                        files: []
                    }).catch(_ => null)
                });
            else
                interaction.reply({
                    ephemeral: true,
                    embeds: AplikoBuildEmbeds(this.client, {
                        style: AplikoEmbedStyle.ERROR,
                        title: 'An error occurred.',
                        description: error.toString(),
                    })
                }).catch(_ => null)
        }
    }

    public get client(): Client {
        return this._client;
    }
}
