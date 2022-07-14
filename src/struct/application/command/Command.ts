import {
    SlashCommandBuilder,
    SlashCommandChannelOption,
    SlashCommandIntegerOption,
    SlashCommandRoleOption,
    SlashCommandStringOption,
    SlashCommandSubcommandBuilder,
    SlashCommandUserOption,
} from '@discordjs/builders';
import {
    CategoryChannel,
    CommandInteraction,
    CommandInteractionOption,
    PermissionResolvable,
    RoleResolvable,
    TextChannel,
    UserResolvable,
} from 'discord.js';

import { Client, SubCommand } from '../../..';
import { AplikoBuildEmbeds, AplikoEmbedStyle } from '../../../util/conversion/AplikoEmbed.ts';
import { ThrowError } from '../../../util/Errors';
import { CommandOption } from './CommandOptions';

export class Command {
    
    private _client: Client;
    protected _name: string;
    protected _description: string;
    protected _executor?: Function;
    protected _subCommands: SubCommand[];
    protected _options: CommandOption[];
    protected _requirePermissions: PermissionResolvable[];
    protected _allowedRoles: RoleResolvable[];
    protected _allowedUsers: UserResolvable[];

    public constructor(client: Client) {
        this._client = client;
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

                        return subCommand.callback.apply(this, [interaction, ...await this.resolveOptions(interaction)]);
                    }
                } catch (err) {
                    throw 'An unknown error has occured. (SUB_COMMAND_DEFINITION)';
                }
            }

            if (!this._executor) return;

            return this._executor.apply(this, [interaction, ...await this.resolveOptions(interaction)]);
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

    public async resolveOptions(interaction: CommandInteraction): Promise<any[]> {
        const args: any[] = [];

        if (this._options.length == 0)
            return args;

        for (const option of this._options) {
            const raw = interaction.options.get(option.name);

            if (raw === null)
                continue;

            args.push(await this.resolveOption(interaction, raw));
        }

        return args;
    }

    public async resolveOption(interaction: CommandInteraction, option: CommandInteractionOption): Promise<any> {
        if (option.type === 'STRING') return option.value as string;

        if (option.type === 'INTEGER') return option.value as number;

        if (option.type === 'CHANNEL') {
            const channel = await this.client.findChannel(interaction.guildId!, option.value as string);

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

    public buildOptions(builder: SlashCommandBuilder | SlashCommandSubcommandBuilder, options: CommandOption[]) {
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

    protected get client(): Client {
        return this._client;
    }

    public get name(): string {
        return this._name;
    }

    public get allowedUsers(): UserResolvable[] {
        return this._allowedUsers;
    }

    public get allowedRoles(): RoleResolvable[] {
        return this._allowedRoles;
    }
}