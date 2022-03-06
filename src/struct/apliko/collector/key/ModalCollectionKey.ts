import { ChannelResolvable, GuildMemberResolvable } from 'discord.js';
import { InteractionResponseType } from '../../../..';

export interface ModalCollectionKey {
    userId: string;

    channelId: string;

    modalId: string;

    responseType?: InteractionResponseType;
}
