"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const builders_1 = require("@discordjs/builders");
const AplikoEmbed_ts_1 = require("../util/conversion/AplikoEmbed.ts");
const Errors_1 = require("../util/Errors");
class Command {
    constructor(client) {
        this._bot = client;
        this._name = '';
        this._description = '\u200b';
        this._subCommands = [];
        this._options = [];
        this._requirePermissions = [];
        this._allowedRoles = [];
        this._allowedUsers = [];
    }
    async callExecutors(interaction) {
        try {
            if (this._subCommands.length > 0) {
                try {
                    if (interaction.options.getSubcommand()) {
                        const subCommand = this._subCommands.find((subCommand) => subCommand.name === interaction.options.getSubcommand());
                        if (!subCommand)
                            (0, Errors_1.ThrowError)('COMMAND_MISSING_SUB_COMMAND');
                        return subCommand.callback.apply(this, [interaction, ...this.resolveOptions(interaction)]);
                    }
                }
                catch (err) {
                    throw 'An unknown error has occured. (SUB_COMMAND_DEFINITION)';
                }
            }
            if (!this._executor)
                return;
            return this._executor.apply(this, [interaction, ...this.resolveOptions(interaction)]);
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
    resolveOptions(interaction) {
        const args = [];
        if (interaction.options.data[0]?.options) {
            for (const option of interaction.options.data[0].options) {
                const object = this.resolveOption(interaction, option) || (0, Errors_1.ThrowError)('COMMAND_FALSY_RESOLVED_OPTION: ' + option.name);
                args.push(object);
            }
        }
        return args;
    }
    resolveOption(interaction, option) {
        if (option.type === 'STRING')
            return option.value;
        if (option.type === 'INTEGER')
            return option.value;
        if (option.type === 'CHANNEL') {
            const channel = interaction.guild.channels.resolve(option.channel.id);
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
        if (!this._name)
            this._name = this.constructor.name;
        const commandBuilder = new builders_1.SlashCommandBuilder().setName(this._name).setDescription(this._description);
        this.buildOptions(commandBuilder, this._options);
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
        for (const subCommand of this._subCommands) {
            const subCommandBuilder = new builders_1.SlashCommandSubcommandBuilder().setName(subCommand.name).setDescription(subCommand.description);
            if (subCommand.options)
                this.buildOptions(subCommandBuilder, subCommand.options);
            builder.addSubcommand(subCommandBuilder);
        }
    }
    get client() {
        return this._bot;
    }
    get name() {
        return this._name;
    }
}
exports.Command = Command;
