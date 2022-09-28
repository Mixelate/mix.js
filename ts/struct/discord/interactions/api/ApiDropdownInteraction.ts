import { ComponentType } from '../../../..';
import { Identifiable } from '../../Identifiable';
import { InteractionType } from '../../../..';
import { ApiBaseInteraction } from './ApiBaseInteraction';

export interface ApiDropdownInteraction extends ApiBaseInteraction<InteractionType.MESSAGE_COMPONENT> {
    data: ApiDropdownInteractionData;
}

export interface ApiDropdownInteractionData extends Identifiable {
    component_type: ComponentType.DROPDOWN[];
    values: string[];
}
