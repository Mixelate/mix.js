import { ApiTeamMember } from "./ApiTeamMember";

export interface ApiTeam {
    readonly icon?: string;
    readonly id: string;
    readonly members: ApiTeamMember;
    readonly name: string;
    readonly owner_user_id: string;   
}