import {
  ApiActionRow,
  ComponentType,
  ApiTextField,
  ApiTextFieldResponse,
} from "../../components";
import { Identifiable } from "../../Identifiable";
import { InteractionType } from "../enum";
import { ApiBaseInteraction } from "./ApiBaseInteraction";

export interface ApiModalSubmitInteraction
  extends ApiBaseInteraction<InteractionType.MODAL_SUBMIT> {
  data: ApiModalSubmitInteractionData;
}

export interface ApiModalSubmitInteractionData extends Identifiable {
  components: ApiActionRow<ApiTextFieldResponse>[];
}

export function IsApiModalInteraction(
  baseInteraction: ApiBaseInteraction<InteractionType>
): baseInteraction is ApiModalSubmitInteraction {
  return baseInteraction.type == 5;
}
