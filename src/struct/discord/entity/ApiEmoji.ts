import { ApiUser } from "./ApiUser";

export interface ApiEmoji {
    readonly id?: string;
    readonly name?: string;
    roles?: string[];
    readonly user?: ApiUser;
    readonly require_colons?: boolean;
    readonly managed?: boolean;
    readonly animated?: boolean;
    readonly available?: boolean;
}