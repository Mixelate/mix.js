import { ApiActionRow, ComponentType, ApiTextField, ApiTextFieldResponse } from "../../components";
import { Identifiable } from "../../Identifiable";
import { InteractionType } from "../enum";
import { ApiBaseInteraction } from "./ApiBaseInteraction";

export interface ApiModalInteraction extends ApiBaseInteraction<InteractionType.MODAL_SUBMIT> {

    data: ApiModalInteractionData

}

export interface ApiModalInteractionData extends Identifiable {

    components: ApiActionRow<ApiTextFieldResponse>[]

}

export function IsApiModalInteraction(baseInteraction: ApiBaseInteraction<InteractionType>): baseInteraction is ApiModalInteraction {
    return baseInteraction.type == 5
}