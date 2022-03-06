"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DescribeSubCommand = exports.NameSubCommand = exports.DescribeCommand = exports.NameCommand = exports.CommandExecutor = exports.DefineCommand = exports.SymbolDescription = exports.SymbolName = exports.SymbolExecutor = exports.SymbolCommandOptions = exports.SymbolSubCommands = void 0;
const Errors_1 = require("../../util/Errors");
const GetParameterNames_1 = require("../../util/GetParameterNames");
exports.SymbolSubCommands = Symbol('___SubCommands');
exports.SymbolCommandOptions = Symbol('___CommandOptions');
exports.SymbolExecutor = Symbol('___Executor');
exports.SymbolName = Symbol('___Name');
exports.SymbolDescription = Symbol('___Description');
function DefineCommand(Base) {
    return class extends Base {
        constructor(...args) {
            super(...args);
            const subCommands = Base.prototype[exports.SymbolSubCommands];
            const options = Base.prototype[exports.SymbolCommandOptions];
            const executor = Base.prototype[exports.SymbolExecutor];
            const name = Base.prototype[exports.SymbolName];
            const description = Base.prototype[exports.SymbolDescription];
            if (subCommands)
                for (const subCommand of subCommands)
                    this._subCommands.push(subCommand);
            if (options)
                for (const option of options)
                    this._options.push(option);
            if (executor && executor instanceof Function) {
                this._executor = executor;
            }
            this._name = name ? name : Base.name.toLowerCase();
            if (description)
                this._description = description;
        }
    };
}
exports.DefineCommand = DefineCommand;
const CommandExecutor = (target, propertyKey, descriptor) => {
    // Extract the methods parameter types
    const paramNames = (0, GetParameterNames_1.GetParameterNames)(descriptor.value);
    const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
    // If there's no parameters it's not even accepting a CommandInteraction instance, so let's let the developer know
    if (paramTypes.length == 0 || !paramTypes[0].toString().includes(' CommandInteraction '))
        return (0, Errors_1.ThrowError)(`APLIKO_COMMAND_PARAMS_MISSING_INTERACTION: ${propertyKey}`);
    const options = [];
    // If there's only a CommandInteraction parameter, we can skip option checks.
    if (paramTypes.length > 1) {
        const optionTypes = paramTypes.slice(0, paramTypes.length - 1);
        const optionNames = paramNames.slice(0, paramNames.length - 1);
        // Now let's dynamically register options using all parameters except ComandInteraction
        optionTypes.forEach((paramType, idx) => {
            const paramTypeString = paramType.name.toString();
            // Channel:GuildText
            if (paramTypeString.includes('TextChannel')) {
                options.push({
                    type: 'channel',
                    channelType: 0 /* GuildText */,
                    name: optionNames[idx],
                    description: 'Channel',
                    required: true
                });
            }
            // Channel:GuildCategory
            if (paramTypeString.includes('CategoryChannel')) {
                options.push({
                    type: 'channel',
                    channelType: 4 /* GuildCategory */,
                    name: optionNames[idx],
                    description: 'Category',
                    required: true
                });
            }
            // User
            if (paramTypeString.includes('GuildMember')) {
                options.push({
                    type: 'user',
                    name: optionNames[idx],
                    description: 'Member',
                    required: true
                });
            }
            // Role
            if (paramTypeString.includes('Role')) {
                options.push({
                    type: 'role',
                    name: optionNames[idx],
                    description: 'Role',
                    required: true
                });
            }
            // String
            if (paramTypeString.includes('string')) {
                options.push({
                    type: 'string',
                    choices: undefined,
                    name: optionNames[idx],
                    description: 'Text',
                    required: true
                });
            }
            // Integer
            if (paramTypeString.includes('number')) {
                options.push({
                    type: 'integer',
                    name: optionNames[idx],
                    description: 'Number',
                    required: true
                });
            }
        });
    }
    target[exports.SymbolCommandOptions] = options;
    target[exports.SymbolExecutor] = descriptor.value;
};
exports.CommandExecutor = CommandExecutor;
const NameCommand = (name) => (clazz) => {
    clazz.prototype[exports.SymbolName] = name;
};
exports.NameCommand = NameCommand;
const DescribeCommand = (description) => (clazz) => {
    clazz.prototype[exports.SymbolDescription] = description;
};
exports.DescribeCommand = DescribeCommand;
const NameSubCommand = (name) => (target, propertyKey, descriptor) => {
    target[exports.SymbolName] = name;
};
exports.NameSubCommand = NameSubCommand;
const DescribeSubCommand = (description) => (target, propertyKey, descriptor) => {
    target[exports.SymbolDescription] = description;
};
exports.DescribeSubCommand = DescribeSubCommand;
