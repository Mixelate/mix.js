import { ApiEmbed, ApiEmbedField } from "../api/ApiEmbed";
export declare class Embed {
    static DEFAULT_COLOR: `#${string}`;
    private data;
    private useTwoColumnFieldRows;
    constructor();
    static new(): Embed;
    title(title: string): Embed;
    description(description: string): Embed;
    color(color: `#${string}`): Embed;
    danger(): Embed;
    success(): Embed;
    footer(text: string, imageUrl?: string, proxyImageUrl?: string): Embed;
    image(url: string, width?: number, height?: number): Embed;
    proxyImage(url: string, proxyUrl: string, width?: number, height?: number): Embed;
    thumbnail(url: string, width?: number, height?: number): Embed;
    proxyThumbnail(url: string, proxyUrl: string, width?: number, height?: number): Embed;
    video(url: string, width?: number, height?: number): Embed;
    proxyVideo(url: string, proxyUrl: string, width?: number, height?: number): Embed;
    author(name: string, avatarUrl?: string): Embed;
    linkAuthor(name: string, url: string, avatarUrl?: string): Embed;
    proxyAuthor(name: string, avatarUrl: string, proxyAvatarUrl: string): Embed;
    proxyLinkAuthor(name: string, url: string, avatarUrl: string, proxyAvatarUrl: string): Embed;
    field(title: string, content: string): Embed;
    inlineField(title: string, content: string): Embed;
    fields(...fields: ApiEmbedField[]): this;
    twoColumnFieldRows(): Embed;
    toJSON(): ApiEmbed;
    private HEXToVBColor;
}
