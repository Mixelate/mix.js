export interface ApiMessageReference {
    readonly message_id?: string;
    readonly channel_id?: string;
    readonly guild_id?: string;
    readonly fail_if_not_exists?: boolean;
}
