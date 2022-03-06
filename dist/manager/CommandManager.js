"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
class CommandManager {
    constructor(bot) {
        this.client = bot;
        this._commandMap = new Map();
        this.client.on('ready', this.createCommandsGlobal.bind(this));
        this.client.on('interactionCreate', this.onInteractionCreate.bind(this));
    }
    async onInteractionCreate(interaction) {
        if (!interaction.isCommand())
            return;
        await this._commandMap.get(interaction.commandName)?.callExecutors(interaction);
    }
    async createCommandsGlobal() {
        const guilds = await this.client.fetchGuilds();
        guilds.forEach(guild => {
            this.createCommandsInGuild(guild).catch((_) => { });
        });
    }
    async createCommandsInGuild(guild) {
        const guildCommands = await guild.commands.fetch();
        let commandsToRegister = [...this._commandMap.values()];
        guildCommands
            .filter((guildCommand) => guildCommand.applicationId === this.client.discordClient.application.id)
            .forEach((guildCommand) => {
            const matchingCommand = commandsToRegister.find((command) => command.name === guildCommand.name);
            if (!matchingCommand)
                return guildCommand.delete();
            const compiledCommand = matchingCommand.build();
            let edit = true;
            if (guildCommand.description != compiledCommand.description)
                edit = true;
            if (!edit && guildCommand.options.length != compiledCommand.options.length)
                edit = true;
            if (!edit)
                for (const guildCommandOption of guildCommand.options) {
                    const matchingOption = compiledCommand.options.map((option) => option.toJSON()).find((option) => (option.name = guildCommandOption.name));
                    if (!matchingOption) {
                        edit = true;
                        break;
                    }
                    if (matchingOption.description != guildCommandOption.description) {
                        edit = true;
                        break;
                    }
                    if ('required' in guildCommandOption && matchingOption.required != guildCommandOption.required) {
                        edit = true;
                        break;
                    }
                    if ((guildCommandOption.type === 'SUB_COMMAND' && matchingOption.type != 1 /* Subcommand */) ||
                        (guildCommandOption.type === 'SUB_COMMAND_GROUP' && matchingOption.type != 2 /* SubcommandGroup */) ||
                        (guildCommandOption.type === 'STRING' && matchingOption.type != 3 /* String */) ||
                        (guildCommandOption.type === 'INTEGER' && matchingOption.type != 4 /* Integer */) ||
                        (guildCommandOption.type === 'BOOLEAN' && matchingOption.type != 5 /* Boolean */) ||
                        (guildCommandOption.type === 'USER' && matchingOption.type != 6 /* User */) ||
                        (guildCommandOption.type === 'CHANNEL' && matchingOption.type != 7 /* Channel */) ||
                        (guildCommandOption.type === 'ROLE' && matchingOption.type != 8 /* Role */) ||
                        (guildCommandOption.type === 'MENTIONABLE' && matchingOption.type != 9 /* Mentionable */) ||
                        (guildCommandOption.type === 'NUMBER' && matchingOption.type != 10 /* Number */)) {
                        edit = true;
                        break;
                    }
                }
            if (edit) {
                guild.commands.edit(guildCommand, compiledCommand.toJSON()).then(async (guildCommand) => {
                    await guildCommand.permissions.set({
                        permissions: [
                            {
                                id: guild.roles.everyone.id,
                                type: 1 /* ROLE */,
                                permission: false
                            },
                            ...matchingCommand._allowedUsers.map((user) => {
                                return {
                                    id: this.client.discordClient.users.resolveId(user),
                                    type: 2 /* USER */,
                                    permission: true
                                };
                            })
                        ]
                    });
                });
            }
            else
                console.log('No edits required for command: ' + compiledCommand.name);
            commandsToRegister = commandsToRegister.filter((command) => command !== matchingCommand);
        });
        commandsToRegister.forEach((command) => guild.commands.create(command.build().toJSON()).then(async (guildCommand) => {
            await guildCommand.permissions.add({
                permissions: command._allowedUsers.map((user) => {
                    return {
                        id: this.client.discordClient.users.resolveId(user),
                        type: 2 /* USER */,
                        permission: true
                    };
                })
            });
        }));
    }
    registerCommands(...commands) {
        commands.forEach((command) => this._commandMap.set(command.name, command));
    }
}
exports.CommandManager = CommandManager;
