import { PermissionFlagsBits } from 'discord-api-types';
import { CategoryChannelResolvable, Guild, GuildChannelCreateOptions, GuildMemberResolvable, GuildResolvable, RoleResolvable, OverwriteResolvable, Permissions, TextChannel } from 'discord.js';

export interface CreatePrivateChannelOptions {
    guild: Guild;
    name: string;
    parent?: CategoryChannelResolvable;
    allowedRoles?: RoleResolvable[];
    allowedMembers?: GuildMemberResolvable[];
}

export async function CreatePrivateChannel(options: CreatePrivateChannelOptions): Promise<TextChannel> {
    const channelOptions: GuildChannelCreateOptions = {
        type: 'GUILD_TEXT'
    };

    const permissionOverwrites: OverwriteResolvable[] = [
        {
            type: 'role',
            id: options.guild.roles.everyone.id,
            deny: [Permissions.FLAGS.VIEW_CHANNEL]
        }
    ];

    if (options.parent) channelOptions.parent = options.parent;

    if (options.allowedRoles)
        options.allowedRoles.forEach((allowedRole) => {
            permissionOverwrites.push({
                type: 'role',
                id: allowedRole,
                allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES]
            });
        });

    if (options.allowedMembers)
        options.allowedMembers.forEach((allowedMember) => {
            permissionOverwrites.push({
                type: 'member',
                id: allowedMember,
                allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES]
            });
        });

    channelOptions.permissionOverwrites = permissionOverwrites;
    const channel = await options.guild.channels.create(options.name, channelOptions);
    return channel as TextChannel;
}
