import { InteractionType } from "discord.js";

export interface InteractionData<T extends InteractionType> {

    readonly type: T

    id: string

    applicationId: string

    

}