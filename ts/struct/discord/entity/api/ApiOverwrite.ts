import { OverwriteType } from "../enum/OverwriteType";

export interface ApiOverwrite {
    readonly id: string;
    readonly type: OverwriteType;
    readonly allow: string;
    readonly deny: string;
}