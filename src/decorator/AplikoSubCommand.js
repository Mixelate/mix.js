"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCommandExecutor = void 0;
require("reflect-metadata");
const Errors_1 = require("../util/Errors");
const AplikoCommand_1 = require("./AplikoCommand");
const Reflection_1 = require("../util/Reflection");
const SubCommandExecutor = (name = '', description = '\u200b') => (target, propertyKey, descriptor) => {
    // Extract the methods parameter types
    const paramNames = (0, Reflection_1.GetParameterNames)(descriptor.value);
    const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
    // If there's no parameters it's not even accepting a CommandInteraction instance, so let's let the developer know
    if (paramTypes.length == 0 || !paramTypes[0].toString().includes(' CommandInteraction '))
        return (0, Errors_1.ThrowError)(`APLIKO_SUB_COMMAND_PARAMS_MISSING_INTERACTION: ${propertyKey}`);
    const name = target[AplikoCommand_1.SymbolName];
    const description = target[AplikoCommand_1.SymbolDescription];
    const subCommand = {
        name: name || propertyKey,
        description: description || '\u200b',
        callback: descriptor.value,
        options: []
    };
    // If there's only a CommandInteraction parameter, we can skip option checks.
    if (paramTypes.length > 1) {
        const optionTypes = paramTypes.slice(1, paramTypes.length);
        const optionNames = paramNames.slice(1, paramNames.length);
        // Now let's dynamically register options using all parameters except ComandInteraction
        optionTypes.forEach((paramType, idx) => {
            const paramTypeString = paramType.name.toString();
            // Channel:GuildText
            if (paramTypeString.includes('TextChannel')) {
                subCommand.options.push({
                    type: 'channel',
                    channelType: 0 /* ChannelType.GuildText */,
                    name: optionNames[idx],
                    description: 'Text channel',
                    required: true
                });
            }
            // Channel:GuildCategory
            if (paramTypeString.includes('CategoryChannel')) {
                subCommand.options.push({
                    type: 'channel',
                    channelType: 4 /* ChannelType.GuildCategory */,
                    name: optionNames[idx],
                    description: 'Channel category',
                    required: true
                });
            }
            // User
            if (paramTypeString.includes('GuildMember')) {
                subCommand.options.push({
                    type: 'user',
                    name: optionNames[idx],
                    description: 'Member',
                    required: true
                });
            }
            // Role
            if (paramTypeString.includes('Role')) {
                subCommand.options.push({
                    type: 'role',
                    name: optionNames[idx],
                    description: 'Role',
                    required: true
                });
            }
            // String
            if (paramTypeString.includes('string')) {
                subCommand.options.push({
                    type: 'string',
                    choices: undefined,
                    name: optionNames[idx],
                    description: 'Text',
                    required: true
                });
            }
            // Integer
            if (paramTypeString.includes('number')) {
                subCommand.options.push({
                    type: 'integer',
                    name: optionNames[idx],
                    description: 'Number',
                    required: true
                });
            }
        });
    }
    target[AplikoCommand_1.SymbolSubCommands] = target[AplikoCommand_1.SymbolSubCommands] || [];
    target[AplikoCommand_1.SymbolSubCommands].push(subCommand);
};
exports.SubCommandExecutor = SubCommandExecutor;
