import { ApplicationCommandOptionType } from 'discord-api-types';
import { Guild, Interaction } from 'discord.js';
import { Client } from '../Client';
import { Command } from '../struct/application/command/Command';
import { AplikoBuildEmbeds, AplikoEmbedStyle } from '../util/conversion/AplikoEmbed.ts';


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
        try {
            await this._commandMap.get(interaction.commandName)?.callExecutors(interaction);
        } catch (error: any) {
            if (interaction.deferred)
                return await interaction.editReply({
                    embeds: AplikoBuildEmbeds(this.client, {
                        style: AplikoEmbedStyle.ERROR,
                        description: 'An error occurred while processing your command.',
                        footer: {
                            content: error.toString()
                        }
                    }),
                    components: [],
                    files: []
                }).catch(_ => {});
            else
                interaction.reply({
                    embeds: AplikoBuildEmbeds(this.client, {
                        style: AplikoEmbedStyle.ERROR,
                        description: 'An error occurred while processing your command.',
                        footer: {
                            content: error.toString()
                        }
                    })
                }).catch(_ => null)
        }
    }

    public async createCommandsGlobal() {
        const guilds = await this.client.fetchGuilds();

        guilds.forEach(guild => {
            console.log(this.client.options.id + ' ' + guild.name)
            this.createCommandsInGuild(guild).catch((err) => { console.log(err) });
        });
    }

    public async createCommandsInGuild(guild: Guild) {
        const guildCommands = await guild.commands.fetch();
        let commandsToRegister = [...this._commandMap.values()];

        guildCommands
            .filter((guildCommand) => guildCommand.applicationId === this.client.discordClient.application!.id)
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

                        if (
                            (option.type === 'SUB_COMMAND' && matchingOption.type != ApplicationCommandOptionType.Subcommand) ||
                            (option.type === 'SUB_COMMAND_GROUP' && matchingOption.type != ApplicationCommandOptionType.SubcommandGroup) ||
                            (option.type === 'STRING' && matchingOption.type != ApplicationCommandOptionType.String) ||
                            (option.type === 'INTEGER' && matchingOption.type != ApplicationCommandOptionType.Integer) ||
                            (option.type === 'BOOLEAN' && matchingOption.type != ApplicationCommandOptionType.Boolean) ||
                            (option.type === 'USER' && matchingOption.type != ApplicationCommandOptionType.User) ||
                            (option.type === 'CHANNEL' && matchingOption.type != ApplicationCommandOptionType.Channel) ||
                            (option.type === 'ROLE' && matchingOption.type != ApplicationCommandOptionType.Role) ||
                            (option.type === 'MENTIONABLE' && matchingOption.type != ApplicationCommandOptionType.Mentionable) ||
                            (option.type === 'NUMBER' && matchingOption.type != ApplicationCommandOptionType.Number)
                        )
                            return false;

                        return true;
                    }).every(edit => true);

                if (edit)
                    guild.commands.edit(guildCommand, compiledCommand.toJSON())

                commandsToRegister = commandsToRegister.filter((command) => command !== matchingCommand);
            });

        commandsToRegister.forEach((command) =>
            guild.commands.create(command.build().toJSON()).then(async (guildCommand) => {
                // await guildCommand.permissions.add({
                //     permissions: command._allowedUsers.map((user) => {
                //         return {
                //             id: this.client.discordClient.users.resolveId(user)!,
                //             type: ApplicationCommandPermissionTypes.USER,
                //             permission: true
                //         };
                //     })
                // });
            })
        );
    }

    registerCommands(...commands: Command[]) {
        commands.forEach((command) => this._commandMap.set(command.name, command));
    }
}
