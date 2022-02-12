import { Message } from "discord.js"
import { MessageCallbacks } from "../DecoratorSymbols"

export const MessageCallback =  (
    target: any,
    _: string,
    descriptor: PropertyDescriptor
) => {
    target[MessageCallbacks] = target[MessageCallbacks] || new Array<(message: Message) => Promise<any>>()
    target[MessageCallbacks].push(descriptor.value!)
}