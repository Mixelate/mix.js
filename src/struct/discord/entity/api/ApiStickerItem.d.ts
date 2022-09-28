import { StickerFormatType } from "../enum/StickerFormatType";
export interface ApiStickerItem {
    readonly id: string;
    readonly name: string;
    readonly format_type: StickerFormatType;
}
