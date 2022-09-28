import { ApiComponent } from "../../components/api/ApiComponent";
import { ApiEmbed } from "../../components/api/ApiEmbed";
import { ApiMessageInteraction } from "../../interactions/api/ApiMessageInteraction";
import { ApiApplication } from "./ApiApplication";
import { ApiAttachment } from "./ApiAttachment";
import { ApiChannel } from "./ApiChannel";
import { ApiChannelMention } from "./ApiChannelMention";
import { ApiGuildMember } from "./ApiGuildMember";
import { ApiMessageActivity } from "./ApiMessageActivity";
import { ApiMessageReference } from "./ApiMessageReference";
import { ApiReaction } from "./ApiReaction";
import { ApiSticker } from "./ApiSticker";
import { ApiStickerItem } from "./ApiStickerItem";
import { ApiUser } from "./ApiUser";

export interface ApiMessage {
    readonly id: string;
    readonly channel_id: string;
    readonly guild_id?: string;
    readonly author: ApiUser;
    readonly member?: ApiGuildMember;
    readonly content: string;
    readonly timestamp: string;
    readonly edited_timestamp: string;
    readonly tts: boolean;
    readonly mention_everyone: boolean;
    readonly mentions: ApiUser[];
    readonly mention_roles: string[];
    readonly mention_channels?: ApiChannelMention[];
    readonly attachments: ApiAttachment[];
    readonly embeds: ApiEmbed[];
    readonly reactions?: ApiReaction[];
    readonly nonce?: number;
    readonly pinned: boolean;
    readonly webhook_id?: string;
    readonly type: number;
    readonly activity?: ApiMessageActivity; 
    readonly application?: ApiApplication 
    readonly application_id?: string;
    readonly message_reference?: ApiMessageReference;
    readonly flags?: number;
    readonly referenced_message?: ApiMessage;
    readonly interaction?: ApiMessageInteraction;
    readonly thread?: ApiChannel;
    readonly components?: ApiComponent[];
    readonly sticker_items?: ApiStickerItem[];
    readonly stickers?: ApiSticker[];
}