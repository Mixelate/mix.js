import { ChannelResolvable, GuildMemberResolvable, InteractionResponseType } from "discord.js";

export interface FormCollectionKey {

    userId: string;

    channelId: string;

    modalId: string;

    responseType?: InteractionResponseType

}