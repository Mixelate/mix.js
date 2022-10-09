"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePrivateChannel = void 0;
const discord_js_1 = require("discord.js");
async function CreatePrivateChannel(options) {
    const channelOptions = {
        type: 'GUILD_TEXT'
    };
    const permissionOverwrites = [
        {
            type: 'role',
            id: options.guild.roles.everyone.id,
            deny: [discord_js_1.Permissions.FLAGS.VIEW_CHANNEL]
        }
    ];
    if (options.parent)
        channelOptions.parent = options.parent;
    if (options.allowedRoles)
        options.allowedRoles.forEach((allowedRole) => {
            permissionOverwrites.push({
                type: 'role',
                id: allowedRole,
                allow: [discord_js_1.Permissions.FLAGS.VIEW_CHANNEL, discord_js_1.Permissions.FLAGS.SEND_MESSAGES]
            });
        });
    if (options.allowedMembers)
        options.allowedMembers.forEach((allowedMember) => {
            permissionOverwrites.push({
                type: 'member',
                id: allowedMember,
                allow: [discord_js_1.Permissions.FLAGS.VIEW_CHANNEL, discord_js_1.Permissions.FLAGS.SEND_MESSAGES]
            });
        });
    channelOptions.permissionOverwrites = permissionOverwrites;
    const channel = await options.guild.channels.create(options.name, channelOptions);
    return channel;
}
exports.CreatePrivateChannel = CreatePrivateChannel;
