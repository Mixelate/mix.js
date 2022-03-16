import { StickerFormatType } from "discord.js";
import { ApiUser } from "./ApiUser";
import { StickerType } from "./enum/StickerType";

export interface ApiSticker {
    readonly id: string;
    readonly pack_id?: string;
    readonly name: string;
    readonly description?: string;
    readonly tags: string;
    readonly asset?: string;
    readonly type: StickerType;
    readonly format_type: StickerFormatType;
    readonly available?: boolean;
    readonly guild_id?: string;
    readonly user?: ApiUser;
    readonly sort_value?: number;
}