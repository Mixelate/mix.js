"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
const AplikoEmbed_ts_1 = require("../util/conversion/AplikoEmbed.ts");
class CommandManager {
    constructor(client) {
        this.client = client;
        this._commandMap = new Map();
        client.on('ready', this.createCommandsGlobal.bind(this));
        client.on('interactionCreate', this.onInteractionCreate.bind(this));
    }
    async onInteractionCreate(interaction) {
        if (!interaction.isCommand())
            return;
        try {
            await this._commandMap.get(interaction.commandName)?.callExecutors(interaction);
        }
        catch (error) {
            if (interaction.deferred)
                return await interaction.editReply({
                    embeds: (0, AplikoEmbed_ts_1.AplikoBuildEmbeds)(this.client, {
                        style: AplikoEmbed_ts_1.AplikoEmbedStyle.ERROR,
                        description: 'An error occurred while processing your command.',
                        footer: {
                            content: error.toString()
                        }
                    }),
                    components: [],
                    files: []
                }).catch(_ => { });
            else
                interaction.reply({
                    embeds: (0, AplikoEmbed_ts_1.AplikoBuildEmbeds)(this.client, {
                        style: AplikoEmbed_ts_1.AplikoEmbedStyle.ERROR,
                        description: 'An error occurred while processing your command.',
                        footer: {
                            content: error.toString()
                        }
                    })
                }).catch(_ => null);
        }
    }
    async createCommandsGlobal() {
        const guilds = await this.client.fetchGuilds();
        guilds.forEach(guild => {
            console.log(this.client.options.id + ' ' + guild.name);
            this.createCommandsInGuild(guild).catch((err) => { console.log(err); });
        });
    }
    async createCommandsInGuild(guild) {
        const guildCommands = await guild.commands.fetch();
        let commandsToRegister = [...this._commandMap.values()];
        guildCommands
            .filter((guildCommand) => guildCommand.applicationId === this.client.discordClient.application.id)
            .forEach(async (guildCommand) => {
            const matchingCommand = commandsToRegister.find((command) => command.name === guildCommand.name);
            if (!matchingCommand)
                return guildCommand.delete();
            const compiledCommand = matchingCommand.build();
            let edit = guildCommand.description != compiledCommand.description
                || compiledCommand.options.length != 0
                || guildCommand.options.length != compiledCommand.options.length
                || guildCommand.defaultPermission != compiledCommand.defaultPermission
                || !guildCommand.options.map(option => {
                    const matchingOption = compiledCommand.options
                        .map(_ => _.toJSON())
                        .find(matchingOption => matchingOption.name === option.name);
                    if (!matchingOption)
                        return false;
                    if (matchingOption.description != option.description)
                        return false;
                    if ('required' in option && matchingOption.required != option.required)
                        return false;
                    if ((option.type === 'SUB_COMMAND' && matchingOption.type != 1 /* ApplicationCommandOptionType.Subcommand */) ||
                        (option.type === 'SUB_COMMAND_GROUP' && matchingOption.type != 2 /* ApplicationCommandOptionType.SubcommandGroup */) ||
                        (option.type === 'STRING' && matchingOption.type != 3 /* ApplicationCommandOptionType.String */) ||
                        (option.type === 'INTEGER' && matchingOption.type != 4 /* ApplicationCommandOptionType.Integer */) ||
                        (option.type === 'BOOLEAN' && matchingOption.type != 5 /* ApplicationCommandOptionType.Boolean */) ||
                        (option.type === 'USER' && matchingOption.type != 6 /* ApplicationCommandOptionType.User */) ||
                        (option.type === 'CHANNEL' && matchingOption.type != 7 /* ApplicationCommandOptionType.Channel */) ||
                        (option.type === 'ROLE' && matchingOption.type != 8 /* ApplicationCommandOptionType.Role */) ||
                        (option.type === 'MENTIONABLE' && matchingOption.type != 9 /* ApplicationCommandOptionType.Mentionable */) ||
                        (option.type === 'NUMBER' && matchingOption.type != 10 /* ApplicationCommandOptionType.Number */))
                        return false;
                    return true;
                }).every(edit => true);
            if (edit)
                guild.commands.edit(guildCommand, compiledCommand.toJSON());
            commandsToRegister = commandsToRegister.filter((command) => command !== matchingCommand);
        });
        commandsToRegister.forEach((command) => guild.commands.create(command.build().toJSON()).then(async (guildCommand) => {
            // await guildCommand.permissions.add({
            //     permissions: command._allowedUsers.map((user) => {
            //         return {
            //             id: this.client.discordClient.users.resolveId(user)!,
            //             type: ApplicationCommandPermissionTypes.USER,
            //             permission: true
            //         };
            //     })
            // });
        }));
    }
    registerCommands(...commands) {
        commands.forEach((command) => this._commandMap.set(command.name, command));
    }
}
exports.CommandManager = CommandManager;
