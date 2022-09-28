import { SelectMenuInteraction } from "discord.js";
import { InteractionContext } from "./InteractionContext";

export interface DropdownInteractionContext extends InteractionContext {
    interaction: SelectMenuInteraction;
}