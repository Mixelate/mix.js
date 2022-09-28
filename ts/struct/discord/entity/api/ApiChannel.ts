import { ChannelType } from "discord-api-types";
import { ApiGuildMember } from "./ApiGuildMember";
import { ApiOverwrite } from "./ApiOverwrite";
import { ApiThreadMetadata } from "./ApiThreadMetadata";
import { ApiUser } from "./ApiUser";

export interface ApiChannel {
    readonly id: string;
    readonly type: ChannelType;
    readonly guild_id?: string;
    readonly position?: number;
    readonly permission_overwrites?: ApiOverwrite[];
    readonly name?: string;
    readonly topic?: string;
    readonly nsfw?: boolean;
    readonly last_message_id?: string;
    readonly bitrate?: number;
    readonly user_limit?: number;
    readonly rate_limit_per_user?: number;
    readonly recipients?: ApiUser[];
    readonly icon?: string;
    readonly owner_id?: string;
    readonly application_id?: string;
    readonly parent_id?: string;
    readonly last_pin_timestamp?: string;
    readonly rtc_region?: string;
    readonly video_quality_mode?: number;
    readonly message_count?: number;
    readonly member_count?: number;
    readonly thread_metadata?: ApiThreadMetadata;
    readonly member?: ApiGuildMember;
    readonly default_auto_archive_duration?: number;
    readonly permissions?: string;
}