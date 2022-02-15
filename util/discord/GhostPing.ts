import { TextChannel } from "discord.js";

export const GhostPing = (channel: TextChannel, id: string) => {
  channel
    .send(`<@${id}>`)
    .then((message) => setTimeout(() => message.delete(), 50));
};

export const GhostPingRole = (channel: TextChannel, id: string) => {
  channel
    .send(`<@&${id}>`)
    .then((message) => setTimeout(() => message.delete(), 50))
}