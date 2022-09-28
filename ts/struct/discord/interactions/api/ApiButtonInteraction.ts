import { ComponentType } from '../../../..';
import { Identifiable } from '../../Identifiable';
import { InteractionType } from '../../../..';
import { ApiBaseInteraction } from './ApiBaseInteraction';

export interface ApiButtonInteraction extends ApiBaseInteraction<InteractionType.MESSAGE_COMPONENT> {
    data: ApiButtonInteractionData;
}

export interface ApiButtonInteractionData extends Identifiable {
    component_type: ComponentType.BUTTON;
}
