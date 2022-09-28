import { ApiGuildMember, ApiUser } from '../../../..';
import { InteractionType } from '../../../..';
export interface ApiMessageInteraction {
    id: string;
    type: InteractionType;
    name: string;
    user: ApiUser;
    member?: ApiGuildMember;
}
