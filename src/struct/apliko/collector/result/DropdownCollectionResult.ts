import { GuildMemberResolvable, MessageComponentInteraction, MessageResolvable, SelectMenuInteraction } from 'discord.js';

export interface DropdownCollectionResult {
    value: string,
    interaction: SelectMenuInteraction
}

export interface ComponentCollectionResult {
    value: string,
    interaction: MessageComponentInteraction;
}

export interface ComponentCollectionKeyV2 {
    memberResolvable?: GuildMemberResolvable;
    messageResolvable: MessageResolvable;
}