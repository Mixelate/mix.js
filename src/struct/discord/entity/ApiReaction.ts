import { ApiEmoji } from "./ApiEmoji";

export interface ApiReaction {
    count: number;
    me: boolean;
    emoji: ApiEmoji;
}