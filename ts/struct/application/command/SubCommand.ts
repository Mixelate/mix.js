import { CommandInteraction } from "discord.js";
import { CommandOption } from "./CommandOptions";

export interface SubCommand {
    name: string;
    description: string;
    options?: CommandOption[];
    callback: (interaction: CommandInteraction, ...options: any[]) => Promise<any>;
}