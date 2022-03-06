import { GuildMemberResolvable, MessageResolvable } from 'discord.js';

export interface ComponentCollectionKey {
    guildMemberResolvable?: GuildMemberResolvable;
    messageResolvable: MessageResolvable;
    componentId: string;
}
