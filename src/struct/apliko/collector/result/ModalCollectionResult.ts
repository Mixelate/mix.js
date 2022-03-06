import { ModalSubmitInteraction } from "index";

export interface ModalCollectionResult {
    responses: Map<string, string>;
     interaction: ModalSubmitInteraction;
}