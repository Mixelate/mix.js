"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const discord_js_1 = require("discord.js");
const ComponentInteractionData_1 = require("../struct/apliko/ComponentInteractionData");
const ApiModalInteraction_1 = require("../struct/discord/interactions/api/ApiModalInteraction");
const ModalSubmitInteraction_1 = require("../struct/discord/interactions/parser/ModalSubmitInteraction");
const AplikoEmbed_ts_1 = require("../util/conversion/AplikoEmbed.ts");
const Errors_1 = require("../util/Errors");
class Controller {
    constructor(client, channelId) {
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
        client.on('interactionCreate', (interaction) => {
            if ((0, ApiModalInteraction_1.IsApiModalInteraction)(interaction)) {
                const modalSubmitInteraction = new ModalSubmitInteraction_1.ModalSubmitInteraction(client, interaction);
                if (interaction.channel_id != this.channelId)
                    return;
                return new Promise(async (resolve, reject) => {
                    try {
                        const componentInteractionData = await (0, ComponentInteractionData_1.FetchComponentInteractionData)(modalSubmitInteraction.getCustomId());
                        await this.modalCallbacks.get(componentInteractionData.componentId)?.apply(this, [
                            {
                                interaction: modalSubmitInteraction,
                                data: componentInteractionData
                            }
                        ]);
                    }
                    catch (err) {
                        await modalSubmitInteraction.handleError(err);
                    }
                    resolve();
                });
            }
        });
    }
    async load() {
        if (!(await (0, Errors_1.SilentCatch)(this.getChannelInstance.bind(this), this)))
            return (this._stopped = true);
        this.loadCallbacks.forEach(async (loadCallback) => await loadCallback.apply(this));
    }
    async stop() {
        this._stopped = true;
        this.stopCallbacks.forEach(async (stopCallback) => await stopCallback.apply(this));
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
            await interaction.deferReply({ ephemeral: true }).catch((_) => { });
            await interaction.editReply({
                embeds: (0, AplikoEmbed_ts_1.AplikoBuildEmbeds)(this.client, {
                    style: AplikoEmbed_ts_1.AplikoEmbedStyle.ERROR,
                    description: 'An error occurred while processing your interaction.',
                    footer: {
                        content: error.toString()
                    }
                }),
                components: []
            });
        }
    }
    async onMessageCreate(message) {
        this.messageCallbacks.forEach((messageCallback) => messageCallback.apply(this, [message]));
    }
    async getChannelInstance() {
        const apiChannel = (await this._client.discordClient.channels.fetch(this._channelId)) ?? (0, Errors_1.ThrowError)('APLIKO_CHANNEL_CONTROLLER_GET_INST_FALSY_API');
        const resolvedChannel = this._client.discordClient.channels.resolve(apiChannel) ?? (0, Errors_1.ThrowError)('APLIKO_CHANNEL_CONTROLLER_GET_INST_FALSY_RESOLVE');
        if (!(resolvedChannel instanceof discord_js_1.TextChannel))
            (0, Errors_1.ThrowError)('APLIKO_CHANNEL_CONTROLLER_GET_INST_CAST');
        return resolvedChannel;
    }
    get client() {
        return this._client;
    }
    get channelId() {
        return this._channelId;
    }
    get loaded() {
        return this._loaded;
    }
    get stopped() {
        return this._stopped;
    }
}
exports.Controller = Controller;
