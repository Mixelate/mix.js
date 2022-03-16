import { ApiTeam } from "./ApiTeam";
import { ApiUser } from "./ApiUser";

export interface ApiApplication {
    readonly id: string;
    readonly name: string;
    readonly icon?: string;
    readonly description: string;
    readonly rpc_origins?: string[];
    readonly bot_public: boolean;
    readonly bot_require_code_grant: boolean;
    readonly terms_of_service_url?: string;
    readonly privacy_policy_url?: string;
    readonly owner?: ApiUser;
    readonly summary: string;
    readonly verify_key: string;
    readonly team?: ApiTeam;
    readonly guild_id?: string;
    readonly primary_sku_id?: string;
    readonly slug?: string;
    readonly cover_image?: string;
    readonly flags?: number;
}