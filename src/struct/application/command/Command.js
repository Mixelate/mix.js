"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const builders_1 = require("@discordjs/builders");
const AplikoEmbed_ts_1 = require("../../../util/conversion/AplikoEmbed.ts");
const Errors_1 = require("../../../util/Errors");
class Command {
    constructor(client) {
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
    async callExecutors(interaction) {
        try {
            if (this.subCommands.length > 0) {
                try {
                    if (interaction.options.getSubcommand()) {
                        const subCommand = this.subCommands.find((subCommand) => subCommand.name === interaction.options.getSubcommand());
                        if (!subCommand)
                            (0, Errors_1.ThrowError)('COMMAND_MISSING_SUB_COMMAND');
                        const options = await this.resolveOptions(interaction);
                        return subCommand.callback.apply(this, [interaction, ...await this.resolveOptions(interaction, subCommand)]);
                    }
                }
                catch (err) {
                    throw 'An unknown error has occured. (SUB_COMMAND_DEFINITION)';
                }
            }
            if (!this.executor)
                return;
            return this.executor.apply(this, [interaction, ...await this.resolveOptions(interaction)]);
        }
        catch (error) {
            await interaction.deferReply({ ephemeral: true }).catch((_) => { });
            await interaction.editReply({
                embeds: (0, AplikoEmbed_ts_1.AplikoBuildEmbeds)(this.client, {
                    style: AplikoEmbed_ts_1.AplikoEmbedStyle.ERROR,
                    description: 'An error occurred while processing your interaction.',
                    footer: {
                        content: error.toString()
                    }
                })
            });
        }
    }
    async resolveOptions(interaction, subCommand) {
        const args = [];
        if (subCommand) {
            if (!subCommand.options)
                return args;
            if (subCommand.options.length == 0)
                return args;
        }
        else {
            if (this.options.length == 0)
                return args;
        }
        for (const option of subCommand ? subCommand.options : this.options) {
            const raw = interaction.options.get(option.name);
            if (raw === null)
                continue;
            args.push(await this.resolveOption(interaction, raw));
        }
        return args;
    }
    async resolveOption(interaction, option) {
        if (option.type === 'STRING')
            return option.value;
        if (option.type === 'INTEGER')
            return option.value;
        if (option.type === 'CHANNEL') {
            const channel = await this.client.findChannel(interaction.guildId, option.value);
            if (!channel)
                return undefined;
            switch (option.channel.type) {
                case 'GUILD_TEXT': {
                    return channel;
                }
                case 'GUILD_CATEGORY': {
                    return channel;
                }
                default: {
                    return undefined;
                }
            }
        }
        if (option.type === 'ROLE')
            return interaction.guild.roles.resolve(option.role.id) || undefined;
        if (option.type === 'USER')
            return interaction.guild.members.resolve(option.user.id) || undefined;
    }
    build() {
        if (!this.name)
            this.name = this.constructor.name;
        const commandBuilder = new builders_1.SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .setDefaultPermission(this.allowByDefault);
        this.buildOptions(commandBuilder, this.options);
        this.buildSubCommands(commandBuilder);
        return commandBuilder;
    }
    buildOptions(builder, options) {
        for (const option of options) {
            if (option.type === 'string') {
                builder.addStringOption(new builders_1.SlashCommandStringOption()
                    .setName(option.name)
                    .setDescription(option.description ? option.description : '\u200b')
                    .setRequired(option.required ? option.required : false));
            }
            if (option.type === 'integer') {
                builder.addIntegerOption(new builders_1.SlashCommandIntegerOption()
                    .setName(option.name)
                    .setDescription(option.description ? option.description : '\u200b')
                    .setRequired(option.required ? option.required : false));
            }
            if (option.type === 'channel') {
                builder.addChannelOption(new builders_1.SlashCommandChannelOption()
                    .setName(option.name)
                    .setDescription(option.description ? option.description : '\u200b')
                    .setRequired(option.required ? option.required : false)
                    .addChannelType(option.channelType));
            }
            if (option.type === 'role') {
                builder.addRoleOption(new builders_1.SlashCommandRoleOption()
                    .setName(option.name)
                    .setDescription(option.description ? option.description : '\u200b')
                    .setRequired(option.required ? option.required : false));
            }
            if (option.type === 'user') {
                builder.addUserOption(new builders_1.SlashCommandUserOption()
                    .setName(option.name)
                    .setDescription(option.description ? option.description : '\u200b')
                    .setRequired(option.required ? option.required : false));
            }
        }
    }
    buildSubCommands(builder) {
        for (const subCommand of this.subCommands) {
            const subCommandBuilder = new builders_1.SlashCommandSubcommandBuilder().setName(subCommand.name).setDescription(subCommand.description);
            if (subCommand.options)
                this.buildOptions(subCommandBuilder, subCommand.options);
            builder.addSubcommand(subCommandBuilder);
        }
    }
    defaultDisallow() {
        this.allowByDefault = false;
    }
}
exports.Command = Command;
