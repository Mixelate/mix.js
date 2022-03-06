import { TextChannel } from 'discord.js';

export const GhostPing = (channel: TextChannel, id: string) => {
    channel.send(`<@${id}>`).then((message) => setTimeout(() => message.delete(), 100));
};

export const GhostPingRole = (channel: TextChannel, id: string) => {
    channel.send(`<@&${id}>`).then((message) => setTimeout(() => message.delete(), 100));
};

/*

Hello, welcome to **CR3 - Rust Private;** In the private version of **CR3 Private** you'll find basically more A1mbot improvements.

**[ + ]** ESP For up to 3000M+ With the help of a friend
**[ + ]** Aimbot for up to 3000M+ With the help of a friend
**[ + ]** *If you buy an invite for CR3 Rust Private, you can vouch in your friend & I'll give you a 50% Discount for his invite ( You decide to give him for the discount or not; lol )*

Slots : 0/5

**Windows Versions Supported**

1903 - 1909 - 2004
Intel CPU 6+ Generation Only
*/
