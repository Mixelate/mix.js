export interface ApiAttachment {
    readonly id: string;
    readonly filename: string;
    readonly description?: string;
    readonly content_type?: string;
    readonly size: number;
    readonly url: string;
    readonly proxy_url: string;
    readonly height?: number;
    readonly width?: number;
    readonly ephemeral?: boolean;
}
