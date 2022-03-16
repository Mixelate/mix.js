import { ComponentType } from '../../../..';
import { Identifiable } from '../../Identifiable';
import { InteractionType } from '../../../..';
import { ApiBaseInteraction } from './ApiBaseInteraction';
import { ApiUser } from 'struct/discord/entity/ApiUser';
import { ApiGuildMember } from 'struct/discord/entity/ApiGuildMember';

export interface ApiMessageInteraction {
    id: string;
    type: InteractionType;
    name: string;
    user: ApiUser;
    member?: ApiGuildMember;
}