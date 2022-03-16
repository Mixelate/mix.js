import { ApiUser } from "./ApiUser";

export interface ApiGuildMember {
    readonly user: ApiUser;
    readonly nick?: string;
    readonly avatar?: string;
    readonly roles: string[];
    readonly joined_at: string;
    readonly premium_since?: string;
    readonly deaf: boolean;
    readonly mute: boolean;
    readonly pending?: boolean;
    readonly permission?: string;
    readonly communication_disabled_until?: string;
}