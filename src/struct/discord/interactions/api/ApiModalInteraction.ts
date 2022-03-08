import { ApiActionRow, ApiTextFieldResponse, InteractionType } from '../../../../..';
import { Identifiable } from '../../Identifiable';
import { ApiBaseInteraction } from './ApiBaseInteraction';

export interface ApiModalSubmitInteraction extends ApiBaseInteraction<InteractionType.MODAL_SUBMIT> {
    data: ApiModalSubmitInteractionData;
}

export interface ApiModalSubmitInteractionData extends Identifiable {
    components: ApiActionRow<ApiTextFieldResponse>[];
}

export function IsApiModalInteraction(baseInteraction: ApiBaseInteraction<InteractionType>): baseInteraction is ApiModalSubmitInteraction {
    return baseInteraction.type == 5;
}
