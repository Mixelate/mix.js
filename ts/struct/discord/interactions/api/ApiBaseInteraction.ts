
import { ApiGuildMember, ApiUser, InteractionType } from '../../../..';

export interface ApiBaseInteraction<T extends InteractionType = InteractionType> {
    readonly version: number;
    readonly id: string;
    readonly application_id: string;
    readonly token: string;
    readonly type: T;

    readonly guild_id?: string;
    readonly channel_id?: string;
    readonly member?: ApiGuildMember;
    readonly user?: ApiUser;
    readonly locale?: string;
    readonly guild_locale?: string;
    

    message?: {
        id: string;
    };
}
