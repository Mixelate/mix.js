import { ChannelResolvable, GuildMemberResolvable } from "discord.js";
import { InteractionResponseType } from "../../discord";

export interface FormCollectionKey {
  userId: string;

  channelId: string;

  modalId: string;

  responseType?: InteractionResponseType;
}
