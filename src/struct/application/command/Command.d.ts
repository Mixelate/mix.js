import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction, CommandInteractionOption, PermissionResolvable, RoleResolvable, UserResolvable } from 'discord.js';
import { Client, SubCommand } from '../../..';
import { CommandOption } from './CommandOptions';
export declare class Command {
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
    constructor(client: Client);
    callExecutors(interaction: CommandInteraction): Promise<any>;
    resolveOptions(interaction: CommandInteraction, subCommand?: SubCommand): Promise<any[]>;
    resolveOption(interaction: CommandInteraction, option: CommandInteractionOption): Promise<any>;
    build(): SlashCommandBuilder;
    buildOptions(builder: SlashCommandBuilder | SlashCommandSubcommandBuilder, options: CommandOption[]): void;
    buildSubCommands(builder: SlashCommandBuilder): void;
    defaultDisallow(): void;
}
