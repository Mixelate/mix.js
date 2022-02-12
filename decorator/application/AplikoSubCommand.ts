import { ButtonInteraction } from "discord.js"
import { AplikoCommandChannelOption, AplikoCommandIntegerOption, AplikoCommandOption, AplikoCommandRoleOption, AplikoCommandStringOption, AplikoCommandUserOption, AplikoSubCommand } from "../../application/Command"
import { ButtonCallbacks, CALLBACK_WILDCARD } from "../DecoratorSymbols"
import 'reflect-metadata'
import { ThrowError } from "../../util/Errors"
import { SymbolCommandOptions, SymbolDescription, SymbolName, SymbolSubCommands } from "./AplikoCommand"
import { ChannelType } from "discord-api-types"
import { GetParameterNames } from "../../util/GetParameterNames"

export const SubCommandExecutor = (name: string = '', description: string = '\u200b') => (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) => {
    // Extract the methods parameter types
    const paramNames = GetParameterNames(descriptor.value)
    const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey) as any[]

    // If there's no parameters it's not even accepting a CommandInteraction instance, so let's let the developer know
    if (paramTypes.length == 0 || !paramTypes[0].toString().includes(' CommandInteraction '))
        return ThrowError(`APLIKO_SUB_COMMAND_PARAMS_MISSING_INTERACTION: ${propertyKey}`)

    const name = target[SymbolName]
    const description = target[SymbolDescription]

    const subCommand = <AplikoSubCommand>{
        name: name || propertyKey,
        description: description || '\u200b',
        callback: descriptor.value,
        options: []
    }

    // If there's only a CommandInteraction parameter, we can skip option checks. 
    if (paramTypes.length > 1) {
        const optionTypes = paramTypes.slice(1, paramTypes.length)
        const optionNames = paramNames.slice(1, paramNames.length)

        // Now let's dynamically register options using all parameters except ComandInteraction
        optionTypes.forEach((paramType, idx) => {
            const paramTypeString = paramType.toString()

            // Channel:GuildText
            if (paramTypeString.includes(' TextChannel ')) {
                subCommand.options!.push(
                    <AplikoCommandChannelOption>{
                        type: 'channel',
                        channelType: ChannelType.GuildText,
                        name: optionNames[idx],
                        description: 'Text channel',
                        required: true
                    }
                )
            }

            // Channel:GuildCategory
            if (paramTypeString.includes(' CategoryChannel ')) {
                subCommand.options!.push(
                    <AplikoCommandChannelOption>{
                        type: 'channel',
                        channelType: ChannelType.GuildCategory,
                        name: optionNames[idx],
                        description: 'Channel category',
                        required: true
                    }
                )
            }

            // User
            if (paramTypeString.includes(' GuildMember ')) {
                subCommand.options!.push(
                    <AplikoCommandUserOption>{
                        type: 'user',
                        name: optionNames[idx],
                        description: 'User or member',
                        required: true
                    }
                )
            }

            // Role
            if (paramTypeString.includes(' Role ')) {
                subCommand.options!.push(
                    <AplikoCommandRoleOption>{
                        type: 'role',
                        name: optionNames[idx],
                        description: 'Role',
                        required: true
                    }
                )
            }

            // String
            if (paramTypeString.includes(' string ')) {
                subCommand.options!.push(
                    <AplikoCommandStringOption>{
                        type: 'string',
                        choices: undefined,
                        name: optionNames[idx],
                        description: 'Text',
                        required: true
                    }
                )
            }

            // Integer
            if (paramTypeString.includes(' number ')) {
                subCommand.options!.push(
                    <AplikoCommandIntegerOption>{
                        type: 'integer',
                        name: optionNames[idx],
                        description: '\u200b',
                        required: true
                    }
                )
            }
        })
    }

    target[SymbolSubCommands] = target[SymbolSubCommands] || []
    target[SymbolSubCommands].push(subCommand)
}