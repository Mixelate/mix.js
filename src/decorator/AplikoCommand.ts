import { ChannelType } from "discord-api-types";
import { Command } from "../struct/application/command/Command";
import { ChannelCommandOption, CommandOption, IntegerCommandOption, RoleCommandOption, StringCommandOption, UserCommandOption } from "../struct/application/command/CommandOptions";
import { ThrowError } from "../util/Errors";
import { GetParameterNames } from "../util/Reflection";


export const SymbolSubCommands = Symbol('___SubCommands');
export const SymbolCommandOptions = Symbol('___CommandOptions');
export const SymbolExecutor = Symbol('___Executor');
export const SymbolName = Symbol('___Name');
export const SymbolDescription = Symbol('___Description');

export function DefineCommand<T extends { new (...args: any[]): Command }>(Base: T) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);

            const subCommands = Base.prototype[SymbolSubCommands];
            const options = Base.prototype[SymbolCommandOptions];
            const executor = Base.prototype[SymbolExecutor];
            const name = Base.prototype[SymbolName];
            const description = Base.prototype[SymbolDescription];

            if (subCommands) for (const subCommand of subCommands) this.subCommands.push(subCommand);

            if (options) for (const option of options) this.options.push(option);

            if (executor && executor instanceof Function) {
                this.executor = executor;
            }

            this.name = name ? name : Base.name.toLowerCase();

            if (description) this.description = description;
        }
    };
}

export const CommandExecutor = (skipOptions: boolean = false) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // Extract the methods parameter types
    const paramNames = GetParameterNames(descriptor.value);
    const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey) as any[];

    // If there's no parameters it's not even accepting a CommandInteraction instance, so let's let the developer know
    if (paramTypes.length == 0 || !paramTypes[0].toString().includes(' CommandInteraction ')) return ThrowError(`APLIKO_COMMAND_PARAMS_MISSING_INTERACTION: ${propertyKey}`);

    const options: CommandOption[] = [];

    // If there's only a CommandInteraction parameter, we can skip option checks.
    if (!skipOptions && paramTypes.length > 1) {
        const optionTypes = paramTypes.reverse().slice(0, paramTypes.length - 1);
        const optionNames = paramNames.reverse().slice(0, paramNames.length - 1);

        // Now let's dynamically register options using all parameters except ComandInteraction
        optionTypes.forEach((paramType, idx) => {
            const paramTypeString = paramType.name.toString();

            // Channel:GuildText
            if (paramTypeString.includes('TextChannel')) {
                options.push(<ChannelCommandOption>{
                    type: 'channel',
                    channelType: ChannelType.GuildText,
                    name: optionNames[idx],
                    description: 'Channel',
                    required: true
                });
            }

            // Channel:GuildCategory
            if (paramTypeString.includes('CategoryChannel')) {
                options.push(<ChannelCommandOption>{
                    type: 'channel',
                    channelType: ChannelType.GuildCategory,
                    name: optionNames[idx],
                    description: 'Category',
                    required: true
                });
            }

            // User
            if (paramTypeString.includes('GuildMember')) {
                options.push(<UserCommandOption>{
                    type: 'user',
                    name: optionNames[idx],
                    description: 'Member',
                    required: true
                });
            }

            // Role
            if (paramTypeString.includes('Role')) {
                options.push(<RoleCommandOption>{
                    type: 'role',
                    name: optionNames[idx],
                    description: 'Role',
                    required: true
                });
            }

            // String
            if (paramTypeString.includes('string')) {
                options.push(<StringCommandOption>{
                    type: 'string',
                    choices: undefined,
                    name: optionNames[idx],
                    description: 'Text',
                    required: true
                });
            }

            // Integer
            if (paramTypeString.includes('number')) {
                options.push(<IntegerCommandOption>{
                    type: 'integer',
                    name: optionNames[idx],
                    description: 'Number',
                    required: true
                });
            }
        });
    }

    target[SymbolCommandOptions] = options;
    target[SymbolExecutor] = descriptor.value;
};

export const NameCommand = (name: string) => (clazz: Function) => {
    clazz.prototype[SymbolName] = name;
};

export const DescribeCommand = (description: string) => (clazz: Function) => {
    clazz.prototype[SymbolDescription] = description;
};

export const NameSubCommand = (name: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    target[SymbolName] = name;
};

export const DescribeSubCommand = (description: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    target[SymbolDescription] = description;
};
