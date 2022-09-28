import { ApiUser } from "./ApiUser";
export interface ApiTeamMember {
    readonly membership_state: number;
    readonly permissions: string[];
    readonly team_id: string;
    readonly user: ApiUser;
}
