export interface ApiThreadMetadata {
    readonly archived: boolean;
    readonly auto_archive_duration: number;
    readonly archive_timestamp: string;
    readonly locked: boolean;
    readonly invitable?: boolean;
    readonly create_timestamp?: string;
}
