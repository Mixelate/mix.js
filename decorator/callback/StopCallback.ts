import { Message } from "discord.js"
import { StopCallbacks } from "../DecoratorSymbols"

export const StopCallback =  (
    target: any,
    _: string,
    descriptor: PropertyDescriptor
) => {
    target[StopCallbacks] = target[StopCallbacks] || new Array<() => Promise<any>>()
    target[StopCallbacks].push(descriptor.value!)
}