import { SelectMenuInteraction } from "discord.js";
import InteractionContext from "./InteractionContext";

export default interface DropdownInteractionContext extends InteractionContext {
    interaction: SelectMenuInteraction;
}