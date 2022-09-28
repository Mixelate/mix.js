import { Guild } from 'discord.js';
import { Client } from '../Client';
import { Command } from '../struct/application/command/Command';
export declare class CommandManager {
    private client;
    private _commandMap;
    constructor(client: Client);
    private onInteractionCreate;
    createCommandsGlobal(): Promise<void>;
    createCommandsInGuild(guild: Guild): Promise<void>;
    registerCommands(...commands: Command[]): void;
}
