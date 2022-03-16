import { ChannelType } from "./enum/ChannelType";

export interface ApiChannelMention {
    id: string;
    guild_id: string;
    type: ChannelType;
    name: string;
}