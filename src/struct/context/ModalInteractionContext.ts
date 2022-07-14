import { ModalSubmitInteraction } from "struct/discord/interactions/parser/ModalSubmitInteraction";
import InteractionContext from "./InteractionContext";

export default interface ModalInteractionContext extends InteractionContext {
    interaction: ModalSubmitInteraction;
}