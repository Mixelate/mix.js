export interface ApiEmbed {
    title?: string;
    description?: string;
    url?: string;
    timestamp?: string;
    color?: number;
    footer?: ApiEmbedFooter;
    image?: ApiEmbedImage;
    thumbnail?: ApiEmbedThumbnail;
    video?: ApiEmbedVideo;
    provider?: ApiEmbedProvider;
    author?: ApiEmbedAuthor;
    fields?: ApiEmbedField[];
}
export interface ApiEmbedFooter {
    readonly text: string;
    readonly icon_url?: string;
    readonly proxy_icon_url?: string;
}
export interface ApiEmbedImage {
    readonly url: string;
    readonly proxy_url?: string;
    readonly height?: number;
    readonly width?: number;
}
export interface ApiEmbedThumbnail {
    readonly url: string;
    readonly proxy_url?: string;
    readonly height?: number;
    readonly width?: number;
}
export interface ApiEmbedVideo {
    readonly url?: string;
    readonly proxy_url?: string;
    readonly height?: number;
    readonly width?: number;
}
export interface ApiEmbedProvider {
    readonly name?: string;
    readonly url?: string;
}
export interface ApiEmbedAuthor {
    readonly name: string;
    readonly url?: string;
    readonly icon_url?: string;
    readonly proxy_icon_url?: string;
}
export interface ApiEmbedField {
    readonly name: string;
    readonly value: string;
    readonly inline?: boolean;
}
