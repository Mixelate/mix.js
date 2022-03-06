import { Component } from '@discordjs/builders';
import { ButtonInteraction, Interaction, Message, SelectMenuInteraction, TextChannel } from 'discord.js';
import { BaseInteraction, CallbackHandler, Client, RegisterCallbacks } from '..';
import { CALLBACK_WILDCARD } from '../decorator/DecoratorSymbols';
import { AplikoBuildEmbeds, AplikoEmbedStyle } from '../util/conversion/AplikoEmbed.ts';
import { SilentCatch, ThrowError } from '../util/Errors';
import { ButtonInteractionContext, ModalInteractionContext, SelectMenuInteractionContext } from '../struct/apliko/Contexts';
import { FetchComponentInteractionData } from '../struct/apliko/ComponentInteractionData';
import { ApiBaseInteraction } from '../struct/discord/interactions/api/ApiBaseInteraction';
import { InteractionType } from '../struct/discord/interactions/enum/InteractionType';
import { ApiModalSubmitInteraction, IsApiModalInteraction } from '../struct/discord/interactions/api/ApiModalInteraction';
import { ModalSubmitInteraction } from '../struct/discord/interactions/parser/ModalSubmitInteraction';
import { AplikoError } from '..';

export class InteractionHandler implements CallbackHandler {
    protected _client: Client;
    private _stopped: boolean;

    // Callbacks
    public buttonCallbacks: Map<string, (context: ButtonInteractionContext) => Promise<any>>;
    public selectCallbacks: Map<string, (context: SelectMenuInteractionContext) => Promise<any>>;
    public modalCallbacks: Map<string, (context: ModalInteractionContext) => Promise<any>>;

    public messageCallbacks: ((message: Message) => Promise<any>)[];

    public constructor(client: Client) {
        this._client = client;
        this._stopped = false;
        this.buttonCallbacks = new Map();
        this.selectCallbacks = new Map();
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
                    const componentInteractionData = await FetchComponentInteractionData(interaction.getCustomId());

                    await this.modalCallbacks.get(componentInteractionData.componentId)?.apply(this, [
                        <ModalInteractionContext>{
                            interaction: interaction,
                            data: componentInteractionData
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
            if (!error) return console.log(error);

            await interaction.deferReply({ ephemeral: true }).catch((_) => {});
            await interaction.editReply({
                embeds: AplikoBuildEmbeds(this.client, {
                    style: AplikoEmbedStyle.ERROR,
                    description: 'An error occurred while processing your interaction.',
                    footer: {
                        content: error.toString()
                    }
                })
            });
        }
    }

    public get client(): Client {
        return this._client;
    }
}
