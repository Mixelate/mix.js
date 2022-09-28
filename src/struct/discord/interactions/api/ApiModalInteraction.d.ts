import { ApiActionRow } from '../../components/api/ApiActionRow';
import { ApiTextFieldResponse } from '../../components/api/ApiTextField';
import { Identifiable } from '../../Identifiable';
import { InteractionType } from '../enum/InteractionType';
import { ApiBaseInteraction } from './ApiBaseInteraction';
export interface ApiModalSubmitInteraction extends ApiBaseInteraction<InteractionType.MODAL_SUBMIT> {
    data: ApiModalSubmitInteractionData;
}
export interface ApiModalSubmitInteractionData extends Identifiable {
    components: ApiActionRow<ApiTextFieldResponse>[];
}
export declare function IsApiModalInteraction(baseInteraction: ApiBaseInteraction<InteractionType>): baseInteraction is ApiModalSubmitInteraction;
