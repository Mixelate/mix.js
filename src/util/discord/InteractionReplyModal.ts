import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Interaction } from 'discord.js';
import { Modal } from '../..';
import { BaseInteraction } from '../../struct/discord/interactions/parser/BaseInteraction';
import { RespondableInteraction } from './DiscordTypes';

export async function InteractionReplyModal(interaction: Interaction | BaseInteraction, modalInteraction: Modal) {
    const rest = interaction instanceof Interaction ? new REST().setToken(interaction.client.token!) : new REST().setToken(interaction.getClient().discordClient.token!);

    const id = interaction instanceof Interaction ? interaction.id : interaction.getId();

    const token = interaction instanceof Interaction ? interaction.token : interaction.getToken();

    await rest.post(Routes.interactionCallback(id, token), {
        body: {
            type: 9,
            data: {
                type: '5',
                ...modalInteraction.toJSON()
            }
        }
    });
}
