import { ModalSubmitInteraction } from "../discord/interactions/parser/ModalSubmitInteraction";
import { InteractionContext } from "./InteractionContext";
export interface ModalInteractionContext extends InteractionContext {
    interaction: ModalSubmitInteraction;
}
