import { ApiGuildMember, ApiUser, ComponentType } from '../../../..';
import { Identifiable } from '../../Identifiable';
import { InteractionType } from '../../../..';
import { ApiBaseInteraction } from './ApiBaseInteraction';

export interface ApiMessageInteraction {
    id: string;
    type: InteractionType;
    name: string;
    user: ApiUser;
    member?: ApiGuildMember;
}