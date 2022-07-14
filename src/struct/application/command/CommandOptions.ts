import { ChannelType } from "discord-api-types";

export type CommandOption = StringCommandOption | IntegerCommandOption | UserCommandOption | ChannelCommandOption | RoleCommandOption;

export interface BaseCommandOption {
    name: string;
    description?: string;
    required?: boolean;
}

export interface StringCommandOption extends BaseCommandOption {
    type: 'string';
    choices?: string[];
}

export interface IntegerCommandOption extends BaseCommandOption {
    type: 'integer';
}

export interface UserCommandOption extends BaseCommandOption {
    type: 'user';
}

export interface ChannelCommandOption extends BaseCommandOption {
    type: 'channel';
    channelType: typeof ALLOWED_CHANNEL_TYPES[number];
}

export interface RoleCommandOption extends BaseCommandOption {
    type: 'role';
}

// Fuck the discord.js developers lol just use the ChannelType enum???????????????
declare const ALLOWED_CHANNEL_TYPES: readonly [
    ChannelType.GuildText,
    ChannelType.GuildVoice,
    ChannelType.GuildCategory,
    ChannelType.GuildNews,
    ChannelType.GuildStore,
    ChannelType.GuildNewsThread,
    ChannelType.GuildPublicThread,
    ChannelType.GuildPrivateThread,
    ChannelType.GuildStageVoice
];