import { ApplicationCommandOptionType } from "discord-api-types";
import { Guild, Interaction } from "discord.js";
import { Command } from "../application/Command";
import { AplikoBot } from "../Bot";

export class CommandManager {
  private _bot: AplikoBot;
  private _commandMap: Map<string, Command>;

  constructor(bot: AplikoBot) {
    this._bot = bot;
    this._commandMap = new Map();

    this._bot.client.on("ready", this.createCommandsGlobal.bind(this));
    this._bot.client.on(
      "interactionCreate",
      this.onInteractionCreate.bind(this)
    );
  }

  private async onInteractionCreate(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    await this._commandMap
      .get(interaction.commandName)
      ?.callExecutors(interaction);
  }

  public async createCommandsGlobal() {
    const guilds = await this._bot.client.guilds.fetch();

    guilds.forEach((guild) => {
      const resolvedGuild = this._bot.client.guilds.resolve(guild.id);

      if (!resolvedGuild)
        return console.log(
          `Skipped command registration on guild: ${guild.id} (Failed to resolve guild)`
        );

      this.createCommandsInGuild(resolvedGuild).catch((_) => {});
    });
  }

  public async createCommandsInGuild(guild: Guild) {
    const guildCommands = await guild.commands.fetch();
    let commandsToRegister = [...this._commandMap.values()];

    guildCommands
      .filter(
        (guildCommand) =>
          guildCommand.applicationId === this._bot.client.application!.id
      )
      .forEach((guildCommand) => {
        const matchingCommand = commandsToRegister.find(
          (command) => command.name === guildCommand.name
        );

        if (!matchingCommand) return guildCommand.delete();

        const compiledCommand = matchingCommand.build();
        let edit = false;

        if (guildCommand.description != compiledCommand.description)
          edit = true;

        if (
          !edit &&
          guildCommand.options.length != compiledCommand.options.length
        )
          edit = true;

        if (!edit)
          for (const guildCommandOption of guildCommand.options) {
            const matchingOption = compiledCommand.options
              .map((option) => option.toJSON())
              .find((option) => (option.name = guildCommandOption.name));

            if (!matchingOption) {
              edit = true;
              break;
            }

            if (matchingOption.description != guildCommandOption.description) {
              edit = true;
              break;
            }

            if (
              "required" in guildCommandOption &&
              matchingOption.required != guildCommandOption.required
            ) {
              edit = true;
              break;
            }

            if (
              (guildCommandOption.type === "SUB_COMMAND" &&
                matchingOption.type !=
                  ApplicationCommandOptionType.Subcommand) ||
              (guildCommandOption.type === "SUB_COMMAND_GROUP" &&
                matchingOption.type !=
                  ApplicationCommandOptionType.SubcommandGroup) ||
              (guildCommandOption.type === "STRING" &&
                matchingOption.type != ApplicationCommandOptionType.String) ||
              (guildCommandOption.type === "INTEGER" &&
                matchingOption.type != ApplicationCommandOptionType.Integer) ||
              (guildCommandOption.type === "BOOLEAN" &&
                matchingOption.type != ApplicationCommandOptionType.Boolean) ||
              (guildCommandOption.type === "USER" &&
                matchingOption.type != ApplicationCommandOptionType.User) ||
              (guildCommandOption.type === "CHANNEL" &&
                matchingOption.type != ApplicationCommandOptionType.Channel) ||
              (guildCommandOption.type === "ROLE" &&
                matchingOption.type != ApplicationCommandOptionType.Role) ||
              (guildCommandOption.type === "MENTIONABLE" &&
                matchingOption.type !=
                  ApplicationCommandOptionType.Mentionable) ||
              (guildCommandOption.type === "NUMBER" &&
                matchingOption.type != ApplicationCommandOptionType.Number)
            ) {
              edit = true;
              break;
            }
          }

        if (edit) guild.commands.edit(guildCommand, compiledCommand.toJSON());
        else
          console.log("No edits required for command: " + compiledCommand.name);
        commandsToRegister = commandsToRegister.filter(
          (command) => command !== matchingCommand
        );
      });

    commandsToRegister.forEach((command) =>
      guild.commands.create(command.build().toJSON())
    );
  }

  registerCommands(...commands: Command[]) {
    commands.forEach((command) => this._commandMap.set(command.name, command));
  }
}
