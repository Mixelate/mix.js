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

        guild.commands.edit(guildCommand, matchingCommand.build().toJSON());

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
