import { ApplicationCommandOptionType } from 'discord-api-types';
import { Guild, Interaction } from 'discord.js';
import { ApplicationCommandPermissionTypes } from 'discord.js/typings/enums';
import { Client, Command } from '../..';

export class CommandManager {
    private client: Client;
    private _commandMap: Map<string, Command>;

    constructor(client: Client) {
        this.client = client;
        this._commandMap = new Map();

        client.on('ready', this.createCommandsGlobal.bind(this));
        client.on('interactionCreate', this.onInteractionCreate.bind(this));
    }

    private async onInteractionCreate(interaction: Interaction) {
        if (!interaction.isCommand()) return;
        await this._commandMap.get(interaction.commandName)?.callExecutors(interaction);
    }

    public async createCommandsGlobal() {
        const guilds = await this.client.fetchGuilds();
        
        guilds.forEach(guild => {
            console.log(this.client.options.id + ' ' + guild.name)
            this.createCommandsInGuild(guild).catch((err) => {console.log(err)});
        });
    }

    public async createCommandsInGuild(guild: Guild) {
        const guildCommands = await guild.commands.fetch();
        let commandsToRegister = [...this._commandMap.values()];

        guildCommands
            .filter((guildCommand) => guildCommand.applicationId === this.client.discordClient.application!.id)
            .forEach((guildCommand) => {
                const matchingCommand = commandsToRegister.find((command) => command.name === guildCommand.name);

                if (!matchingCommand) return guildCommand.delete();

                const compiledCommand = matchingCommand.build();
                let edit = true;

                if (guildCommand.description != compiledCommand.description) edit = true;

                if (!edit && guildCommand.options.length != compiledCommand.options.length) edit = true;

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

                        if (
                            (guildCommandOption.type === 'SUB_COMMAND' && matchingOption.type != ApplicationCommandOptionType.Subcommand) ||
                            (guildCommandOption.type === 'SUB_COMMAND_GROUP' && matchingOption.type != ApplicationCommandOptionType.SubcommandGroup) ||
                            (guildCommandOption.type === 'STRING' && matchingOption.type != ApplicationCommandOptionType.String) ||
                            (guildCommandOption.type === 'INTEGER' && matchingOption.type != ApplicationCommandOptionType.Integer) ||
                            (guildCommandOption.type === 'BOOLEAN' && matchingOption.type != ApplicationCommandOptionType.Boolean) ||
                            (guildCommandOption.type === 'USER' && matchingOption.type != ApplicationCommandOptionType.User) ||
                            (guildCommandOption.type === 'CHANNEL' && matchingOption.type != ApplicationCommandOptionType.Channel) ||
                            (guildCommandOption.type === 'ROLE' && matchingOption.type != ApplicationCommandOptionType.Role) ||
                            (guildCommandOption.type === 'MENTIONABLE' && matchingOption.type != ApplicationCommandOptionType.Mentionable) ||
                            (guildCommandOption.type === 'NUMBER' && matchingOption.type != ApplicationCommandOptionType.Number)
                        ) {
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
                                    type: ApplicationCommandPermissionTypes.ROLE,
                                    permission: false
                                },
                                ...matchingCommand._allowedUsers.map((user) => {
                                    return {
                                        id: this.client.discordClient.users.resolveId(user)!,
                                        type: ApplicationCommandPermissionTypes.USER,
                                        permission: true
                                    };
                                })
                            ]
                        });
                    });
                } else console.log('No edits required for command: ' + compiledCommand.name);
                commandsToRegister = commandsToRegister.filter((command) => command !== matchingCommand);
            });

        commandsToRegister.forEach((command) =>
            guild.commands.create(command.build().toJSON()).then(async (guildCommand) => {
                await guildCommand.permissions.add({
                    permissions: command._allowedUsers.map((user) => {
                        return {
                            id: this.client.discordClient.users.resolveId(user)!,
                            type: ApplicationCommandPermissionTypes.USER,
                            permission: true
                        };
                    })
                });
            })
        );
    }

    registerCommands(...commands: Command[]) {
        commands.forEach((command) => this._commandMap.set(command.name, command));
    }
}
