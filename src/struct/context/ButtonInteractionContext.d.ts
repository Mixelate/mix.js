import { ButtonInteraction } from "discord.js";
import { InteractionContext } from "./InteractionContext";
export interface ButtonInteractionContext extends InteractionContext {
    interaction: ButtonInteraction;
}
