import { Message } from "discord.js"
import { ButtonInteractionContext, SelectMenuInteractionContext } from "../../struct/apliko/Contexts"
import { ButtonCallbacks, LoadCallbacks, MessageCallbacks, SelectCallbacks, StopCallbacks } from "../DecoratorSymbols"

export interface CallbackHandler {
    loadCallbacks?: (() => Promise<any>)[]
    stopCallbacks?: (() => Promise<any>)[]
    buttonCallbacks?: Map<string, (context: ButtonInteractionContext) => Promise<any>>
    selectCallbacks?: Map<string, (context: SelectMenuInteractionContext) => Promise<any>>
    messageCallbacks?: ((message: Message) => Promise<any>)[]
}

export type CallbackHandlerConstructor = { new(...args: any[]): CallbackHandler }

export function RegisterCallbacks<T extends CallbackHandlerConstructor>(Class: T) {
    return class extends Class {
        constructor(...args: any[]) {
            super(...args)
            const loadCallbacks = Class.prototype[LoadCallbacks]
            const stopCallbacks = Class.prototype[StopCallbacks]
            const buttonCallbacks = Class.prototype[ButtonCallbacks]
            const selectCallbacks = Class.prototype[SelectCallbacks]
            const messageCallbacks = Class.prototype[MessageCallbacks]

            if (this.loadCallbacks && loadCallbacks)
                for (const callback of loadCallbacks)
                    this.loadCallbacks.push(callback)

            if (this.stopCallbacks && stopCallbacks)
                for (const callback of stopCallbacks)
                    this.stopCallbacks.push(callback)

            if (this.buttonCallbacks && buttonCallbacks)
                for (const [customId, callback] of buttonCallbacks)
                    this.buttonCallbacks.set(customId, callback)

            if (this.selectCallbacks && selectCallbacks)
                for (const [customId, callback] of selectCallbacks)
                    this.selectCallbacks.set(customId, callback)

            if (this.messageCallbacks && messageCallbacks)
                for (const callback of messageCallbacks)
                    this.messageCallbacks.push(callback)
        }
    }
}