import {
    SlashCommandBuilder,
    SlashCommandChannelOption,
    SlashCommandIntegerOption,
    SlashCommandRoleOption,
    SlashCommandStringOption,
    SlashCommandSubcommandBuilder,
    SlashCommandUserOption,
} from '@discordjs/builders';
import { Client } from 'Client';
import { ChannelType } from 'discord-api-types/payloads/v9/channel';
import {
    CategoryChannel,
    CommandInteraction,
    CommandInteractionOption,
    PermissionResolvable,
    RoleResolvable,
    TextChannel,
    UserResolvable,
} from 'discord.js';

import { AplikoBuildEmbeds, AplikoEmbedStyle } from '../util/conversion/AplikoEmbed.ts';
import { ThrowError } from '../util/Errors';

export class Command {
    
    public readonly _bot: Client;
    public _name: string;
    public _description: string;
    public _executor?: Function;
    public _subCommands: AplikoSubCommand[];
    public _options: AplikoCommandOption[];
    public _requirePermissions: PermissionResolvable[];
    public _allowedRoles: RoleResolvable[];
    public _allowedUsers: UserResolvable[];

    public constructor(client: Client) {
        this._bot = client;
        this._name = '';
        this._description = '\u200b';
        this._subCommands = [];
        this._options = [];
        this._requirePermissions = [];
        this._allowedRoles = [];
        this._allowedUsers = [];
    }

    public async callExecutors(interaction: CommandInteraction) {
        try {
            if (this._subCommands.length > 0) {
                try {
                    if (interaction.options.getSubcommand()) {
                        const subCommand = this._subCommands.find((subCommand) => subCommand.name === interaction.options.getSubcommand());

                        if (!subCommand) ThrowError('COMMAND_MISSING_SUB_COMMAND');

                        return subCommand.callback.apply(this, [interaction, ...this.resolveOptions(interaction)]);
                    }
                } catch (err) {
                    throw 'An unknown error has occured. (SUB_COMMAND_DEFINITION)';
                }
            }

            if (!this._executor) return;

            return this._executor.apply(this, [interaction, ...this.resolveOptions(interaction)]);
        } catch (error: any) {
            await interaction.deferReply({ ephemeral: true }).catch((_) => {});
            await interaction.editReply({
                embeds: AplikoBuildEmbeds(this.client, {
                    style: AplikoEmbedStyle.ERROR,
                    description: 'An error occurred while processing your interaction.',
                    footer: {
                        content: error.toString()
                    }
                })
            });
        }
    }

    public resolveOptions(interaction: CommandInteraction): any[] {
        const args: any[] = [];

        if (interaction.options.data[0]?.options) {
            for (const option of interaction.options.data[0].options!) {
                const object = this.resolveOption(interaction, option) || ThrowError('COMMAND_FALSY_RESOLVED_OPTION: ' + option.name);

                args.push(object);
            }
        }

        return args;
    }

    public resolveOption(interaction: CommandInteraction, option: CommandInteractionOption): any {
        if (option.type === 'STRING') return option.value as string;

        if (option.type === 'INTEGER') return option.value as number;

        if (option.type === 'CHANNEL') {
            const channel = interaction.guild!.channels.resolve(option.channel!.id);

            if (!channel) return undefined;

            switch (option.channel!.type) {
                case 'GUILD_TEXT': {
                    return channel as TextChannel;
                }

                case 'GUILD_CATEGORY': {
                    return channel as CategoryChannel;
                }

                default: {
                    return undefined;
                }
            }
        }

        if (option.type === 'ROLE') return interaction.guild!.roles.resolve(option.role!.id) || undefined;

        if (option.type === 'USER') return interaction.guild!.members.resolve(option.user!.id) || undefined;
    }

    public build(): SlashCommandBuilder {
        if (!this._name) this._name = this.constructor.name;

        const commandBuilder = new SlashCommandBuilder().setName(this._name).setDescription(this._description);

        this.buildOptions(commandBuilder, this._options);
        this.buildSubCommands(commandBuilder);

        return commandBuilder;
    }

    public buildOptions(builder: SlashCommandBuilder | SlashCommandSubcommandBuilder, options: AplikoCommandOption[]) {
        for (const option of options) {
            if (option.type === 'string') {
                builder.addStringOption(
                    new SlashCommandStringOption()
                        .setName(option.name)
                        .setDescription(option.description ? option.description : '\u200b')
                        .setRequired(option.required ? option.required : false)
                );
            }

            if (option.type === 'integer') {
                builder.addIntegerOption(
                    new SlashCommandIntegerOption()
                        .setName(option.name)
                        .setDescription(option.description ? option.description : '\u200b')
                        .setRequired(option.required ? option.required : false)
                );
            }

            if (option.type === 'channel') {
                builder.addChannelOption(
                    new SlashCommandChannelOption()
                        .setName(option.name)
                        .setDescription(option.description ? option.description : '\u200b')
                        .setRequired(option.required ? option.required : false)
                        .addChannelType(option.channelType)
                );
            }

            if (option.type === 'role') {
                builder.addRoleOption(
                    new SlashCommandRoleOption()
                        .setName(option.name)
                        .setDescription(option.description ? option.description : '\u200b')
                        .setRequired(option.required ? option.required : false)
                );
            }

            if (option.type === 'user') {
                builder.addUserOption(
                    new SlashCommandUserOption()
                        .setName(option.name)
                        .setDescription(option.description ? option.description : '\u200b')
                        .setRequired(option.required ? option.required : false)
                );
            }
        }
    }

    public buildSubCommands(builder: SlashCommandBuilder) {
        for (const subCommand of this._subCommands) {
            const subCommandBuilder = new SlashCommandSubcommandBuilder().setName(subCommand.name).setDescription(subCommand.description);

            if (subCommand.options) this.buildOptions(subCommandBuilder, subCommand.options);

            builder.addSubcommand(subCommandBuilder);
        }
    }

    get client(): Client {
        return this._bot;
    }

    get name(): string {
        return this._name;
    }
}

export interface AplikoSubCommand {
    name: string;
    description: string;
    options?: AplikoCommandOption[];
    callback: (interaction: CommandInteraction, ...options: any[]) => Promise<any>;
}

export interface AplikoCommandBaseOption {
    name: string;
    description?: string;
    required?: boolean;
}

export interface AplikoCommandStringOption extends AplikoCommandBaseOption {
    type: 'string';
    choices?: string[];
}

export interface AplikoCommandIntegerOption extends AplikoCommandBaseOption {
    type: 'integer';
}

export interface AplikoCommandUserOption extends AplikoCommandBaseOption {
    type: 'user';
}

// Fuck the discord.js developers lol just use the ChannelType enum???????????????
declare const allowedChannelTypes: readonly [
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
type ApplicationCommandOptionAllowedChannelTypes = typeof allowedChannelTypes[number];

export interface AplikoCommandChannelOption extends AplikoCommandBaseOption {
    type: 'channel';
    channelType: ApplicationCommandOptionAllowedChannelTypes;
}

export interface AplikoCommandRoleOption extends AplikoCommandBaseOption {
    type: 'role';
}

export type AplikoCommandOption = AplikoCommandStringOption | AplikoCommandIntegerOption | AplikoCommandUserOption | AplikoCommandChannelOption | AplikoCommandRoleOption;
