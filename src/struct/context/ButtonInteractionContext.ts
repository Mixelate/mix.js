import { ButtonInteraction } from "discord.js";
import InteractionContext from "./InteractionContext";

export default interface ButtonInteractionContext extends InteractionContext {
    interaction: ButtonInteraction;
}