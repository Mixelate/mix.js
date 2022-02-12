import { ButtonInteraction, SelectMenuInteraction } from "discord.js"
import { ComponentInteractionDataModel } from "./ComponentInteractionData"

export interface InteractionContext {
    data: ComponentInteractionDataModel
}

export interface ButtonInteractionContext extends InteractionContext {
    interaction: ButtonInteraction
}

export interface SelectMenuInteractionContext extends InteractionContext {
    interaction: SelectMenuInteraction
}