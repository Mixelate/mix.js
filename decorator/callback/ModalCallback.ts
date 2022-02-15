import { ButtonInteraction } from "discord.js"
import { ButtonInteractionContext, ModalInteractionContext } from "../../struct/apliko/Contexts"
import { ThrowError } from "../../util/Errors"
import { GetParameterNames } from "../../util/GetParameterNames"
import { ButtonCallbacks, CALLBACK_WILDCARD, ModalCallbacks } from "../DecoratorSymbols"

export const ModalCallback = (customId: string = CALLBACK_WILDCARD) => (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) => {
    target[ModalCallbacks] = target[ModalCallbacks]
        || new Map<string, (context: ModalInteractionContext) => Promise<any>>()
    target[ModalCallbacks].set(customId, descriptor.value)
}