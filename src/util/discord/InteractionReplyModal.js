"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionReplyModal = void 0;
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const discord_js_1 = require("discord.js");
async function InteractionReplyModal(interaction, modalInteraction) {
    const rest = interaction instanceof discord_js_1.Interaction ? new rest_1.REST().setToken(interaction.client.token) : new rest_1.REST().setToken(interaction.getClient().discordClient.token);
    const id = interaction instanceof discord_js_1.Interaction ? interaction.id : interaction.getId();
    const token = interaction instanceof discord_js_1.Interaction ? interaction.token : interaction.getToken();
    await rest.post(v9_1.Routes.interactionCallback(id, token), {
        body: {
            type: 9,
            data: {
                type: '5',
                ...modalInteraction.toJSON()
            }
        }
    });
}
exports.InteractionReplyModal = InteractionReplyModal;
