import { CategoryChannelResolvable, Guild, GuildMemberResolvable, RoleResolvable, TextChannel } from 'discord.js';
export interface CreatePrivateChannelOptions {
    guild: Guild;
    name: string;
    parent?: CategoryChannelResolvable;
    allowedRoles?: RoleResolvable[];
    allowedMembers?: GuildMemberResolvable[];
}
export declare function CreatePrivateChannel(options: CreatePrivateChannelOptions): Promise<TextChannel>;
