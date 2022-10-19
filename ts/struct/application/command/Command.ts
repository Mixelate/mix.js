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

    client: Client;
    name: string;
    description: string;
    executor?: Function;
    subCommands: SubCommand[];
    options: CommandOption[];
    allowByDefault: boolean;
    requirePermissions: PermissionResolvable[];
    allowedRoles: RoleResolvable[];
    allowedUsers: UserResolvable[];

    public constructor(client: Client) {
        this.client = client;
        this.name = '';
        this.description = '\u200b';
        this.subCommands = [];
        this.options = [];
        this.allowByDefault = true;
        this.requirePermissions = [];
        this.allowedRoles = [];
        this.allowedUsers = [];
    }

    public async callExecutors(interaction: CommandInteraction) {
        try {
            if (this.subCommands.length > 0) {
                try {
                    if (interaction.options.getSubcommand()) {
                        const subCommand = this.subCommands.find((subCommand) => subCommand.name === interaction.options.getSubcommand());

                        if (!subCommand) ThrowError('COMMAND_MISSING_SUB_COMMAND');

                        const options = await this.resolveOptions(interaction);

                        return subCommand.callback.apply(this, [interaction, ...await this.resolveOptions(interaction, subCommand)]);
                    }
                } catch (err) {
                    throw 'An unknown error has occured. (SUB_COMMAND_DEFINITION)';
                }
            }

            if (!this.executor) return;

            return this.executor.apply(this, [interaction, ...await this.resolveOptions(interaction)]);
        } catch (error: any) {
            await interaction.deferReply({ ephemeral: true }).catch((_) => { });
            await interaction.editReply({
                embeds: AplikoBuildEmbeds(this.client, {
                    style: AplikoEmbedStyle.ERROR,
                    title: 'An error occurred.',
                    description: error.toString(),
                })
            });
        }
    }

    public async resolveOptions(interaction: CommandInteraction, subCommand?: SubCommand): Promise<any[]> {
        const args: any[] = [];

        if (subCommand) {
            if (!subCommand.options)
                return args;

            if (subCommand.options.length == 0)
                return args;
        } else {
            if (this.options.length == 0)
                return args;
        }

        for (const option of subCommand ? subCommand.options! : this.options) {
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
        if (!this.name) this.name = this.constructor.name;

        const commandBuilder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .setDefaultPermission(this.allowByDefault)

        this.buildOptions(commandBuilder, this.options);
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
        for (const subCommand of this.subCommands) {
            const subCommandBuilder = new SlashCommandSubcommandBuilder().setName(subCommand.name).setDescription(subCommand.description);

            if (subCommand.options) this.buildOptions(subCommandBuilder, subCommand.options);

            builder.addSubcommand(subCommandBuilder);
        }
    }

    defaultDisallow() {
        this.allowByDefault = false;
    }
}