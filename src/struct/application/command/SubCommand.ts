import { CommandInteraction } from "discord.js";
import { CommandOption } from "./CommandOptions";

export default interface SubCommand {
    name: string;
    description: string;
    options?: CommandOption[];
    callback: (interaction: CommandInteraction, ...options: any[]) => Promise<any>;
}