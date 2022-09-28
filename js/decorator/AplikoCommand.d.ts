import { Command } from "../struct/application/command/Command";
import { CommandOption } from "../struct/application/command/CommandOptions";
export declare const SymbolSubCommands: unique symbol;
export declare const SymbolCommandOptions: unique symbol;
export declare const SymbolExecutor: unique symbol;
export declare const SymbolName: unique symbol;
export declare const SymbolDescription: unique symbol;
export declare function DefineCommand<T extends {
    new (...args: any[]): Command;
}>(Base: T): {
    new (...args: any[]): {
        client: import("..").Client;
        name: string;
        description: string;
        executor?: Function | undefined;
        subCommands: import("..").SubCommand[];
        options: CommandOption[];
        allowByDefault: boolean;
        requirePermissions: import("discord.js").PermissionResolvable[];
        allowedRoles: import("discord.js").RoleResolvable[];
        allowedUsers: import("discord.js").UserResolvable[];
        callExecutors(interaction: import("discord.js").CommandInteraction<import("discord.js").CacheType>): Promise<any>;
        resolveOptions(interaction: import("discord.js").CommandInteraction<import("discord.js").CacheType>, subCommand?: import("..").SubCommand | undefined): Promise<any[]>;
        resolveOption(interaction: import("discord.js").CommandInteraction<import("discord.js").CacheType>, option: import("discord.js").CommandInteractionOption<import("discord.js").CacheType>): Promise<any>;
        build(): import("@discordjs/builders").SlashCommandBuilder;
        buildOptions(builder: import("@discordjs/builders").SlashCommandBuilder | import("@discordjs/builders").SlashCommandSubcommandBuilder, options: CommandOption[]): void;
        buildSubCommands(builder: import("@discordjs/builders").SlashCommandBuilder): void;
        defaultDisallow(): void;
    };
} & T;
export declare const CommandExecutor: (skipOptions?: boolean) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => undefined;
export declare const NameCommand: (name: string) => (clazz: Function) => void;
export declare const DescribeCommand: (description: string) => (clazz: Function) => void;
export declare const NameSubCommand: (name: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare const DescribeSubCommand: (description: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
