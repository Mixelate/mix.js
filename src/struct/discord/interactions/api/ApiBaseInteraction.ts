import { InteractionType } from '../../../..';

export interface ApiBaseInteraction<T extends InteractionType = InteractionType> {
    readonly type: T;

    id: string;
    token: string;

    application_id: string;

    guild_id?: string;

    // TODO: Proper typings
    member?: {
        user: {
            id: string;
        };
    };

    channel_id: string;

    message?: {
        id: string;
    };
}
