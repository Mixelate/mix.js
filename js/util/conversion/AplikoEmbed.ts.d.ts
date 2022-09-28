import { ColorResolvable, MessageEmbed, MessageEmbedThumbnail } from 'discord.js';
import { Client } from '../..';
/**
 * builder pattern is annoying, let's fix it @discord.js LOL
 */
export declare const AplikoEmbedPrimaryColor: ColorResolvable;
export declare const AplikoEmbedSuccessColor: ColorResolvable;
export declare const AplikoEmbedErrorColor: ColorResolvable;
export declare const AplikoEmbedTwoColumnRows: boolean;
export declare const AplikoEmbedMaxAuthorNameSize = 256;
export declare const aplikoEmbedMaxTitleSize = 256;
export declare const AplikoEmbedMaxDescriptionSize = 2048;
export declare const AplikoEmbedMaxFields = 25;
export declare const AplikoEmbedMaxFieldTitleSize = 256;
export declare const AplikoEmbedMaxFieldContentSize = 1024;
export declare const AplikoEmbedMaxFooterContentSize = 2048;
export declare enum AplikoEmbedStyle {
    PRIMARY = 1,
    SUCCESS = 2,
    ERROR = 3,
    CUSTOM = 4
}
export interface AplikoEmbedFooter {
    content: string;
    imageUrl?: string;
}
export interface AplikoEmbedAuthor {
    name: string;
    imageUrl?: string;
    url?: string;
}
export interface AplikoEmbedField {
    title: string;
    content: string;
    inline?: boolean;
}
export interface AplikoEmbed {
    style?: AplikoEmbedStyle;
    customStyle?: ColorResolvable;
    author?: AplikoEmbedAuthor;
    title?: string;
    description?: string;
    footer?: AplikoEmbedFooter;
    thumbnail?: MessageEmbedThumbnail | string;
    fields?: AplikoEmbedField[];
}
export declare function AplikoBuildEmbeds(client: Client, ...aplikoEmbeds: AplikoEmbed[]): MessageEmbed[];
