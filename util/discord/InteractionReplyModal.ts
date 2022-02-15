import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Interaction } from "discord.js";
import { AplikoBot, APLIKO_OPTIONS } from "../../Bot";
import { Modal } from "../../struct/discord/interactions/builder";
import { RepliableInteraction } from "./DiscordTypes";

export async function InteractionReplyModal(interaction: RepliableInteraction, modalInteraction: Modal) {
    const rest = new REST().setToken(interaction.client.token!);
    await rest.post(
        Routes.interactionCallback(interaction.id, interaction.token),
        {
            'body': {
                'type': 9,
                'data': {
                    'type': '5',
                    ...modalInteraction.toJSON() 
                }
            }
        }
    )
}