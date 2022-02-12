import { ChannelResolvable, GuildMemberResolvable, MessageResolvable, UserResolvable } from "discord.js";

export interface MessageCollectionKey {
    userResolvable: UserResolvable
    channelResolvable: ChannelResolvable
}