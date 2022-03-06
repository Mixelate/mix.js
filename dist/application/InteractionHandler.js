"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionHandler = void 0;
const AplikoEmbed_ts_1 = require("../util/conversion/AplikoEmbed.ts");
const ComponentInteractionData_1 = require("../struct/apliko/ComponentInteractionData");
const ModalSubmitInteraction_1 = require("../struct/discord/interactions/parser/ModalSubmitInteraction");
class InteractionHandler {
    constructor(client) {
        this._client = client;
        this._stopped = false;
        this.buttonCallbacks = new Map();
        this.selectCallbacks = new Map();
        this.modalCallbacks = new Map();
        this.messageCallbacks = [];
        this._client.on('interactionCreate', this.onInteractionCreate.bind(this));
        this._client.on('messageCreate', this.onMessageCreate.bind(this));
        this._client.on('wsInteractionCreate', this.onWSInteractionCreate.bind(this));
    }
    async stop() {
        this._stopped = true;
    }
    async onWSInteractionCreate(interaction) {
        if (interaction instanceof ModalSubmitInteraction_1.ModalSubmitInteraction) {
            return new Promise(async (resolve, reject) => {
                try {
                    const componentInteractionData = await (0, ComponentInteractionData_1.FetchComponentInteractionData)(interaction.getCustomId());
                    await this.modalCallbacks.get(componentInteractionData.componentId)?.apply(this, [
                        {
                            interaction: interaction,
                            data: componentInteractionData
                        }
                    ]);
                }
                catch (err) {
                    await interaction.handleError(err);
                }
                resolve();
            });
        }
    }
    async onMessageCreate(message) {
        for (const callback of this.messageCallbacks) {
            callback.apply(this, [message]);
        }
    }
    async onInteractionCreate(interaction) {
        if (this._stopped)
            return;
        if (!interaction.isMessageComponent())
            return;
        try {
            const componentInteractionData = await (0, ComponentInteractionData_1.FetchComponentInteractionData)(interaction.customId);
            if (interaction.isButton()) {
                await this.buttonCallbacks.get(componentInteractionData.componentId)?.apply(this, [
                    {
                        interaction,
                        data: componentInteractionData
                    }
                ]);
            }
            if (interaction.isSelectMenu()) {
                await this.selectCallbacks.get(componentInteractionData.componentId)?.apply(this, [
                    {
                        interaction,
                        data: componentInteractionData
                    }
                ]);
            }
        }
        catch (error) {
            if (!error)
                return console.log(error);
            await interaction.deferReply({ ephemeral: true }).catch((_) => { });
            await interaction.editReply({
                embeds: (0, AplikoEmbed_ts_1.AplikoBuildEmbeds)(this.client, {
                    style: AplikoEmbed_ts_1.AplikoEmbedStyle.ERROR,
                    description: 'An error occurred while processing your interaction.',
                    footer: {
                        content: error.toString()
                    }
                })
            });
        }
    }
    get client() {
        return this._client;
    }
}
exports.InteractionHandler = InteractionHandler;
