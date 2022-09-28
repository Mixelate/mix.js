"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GhostPingRole = exports.GhostPing = void 0;
const GhostPing = async (channel, id) => {
    await channel.send(`<@${id}>`).then((message) => setTimeout(() => message.delete(), 100));
};
exports.GhostPing = GhostPing;
const GhostPingRole = async (channel, id) => {
    await channel.send(`<@&${id}>`).then((message) => setTimeout(() => message.delete(), 100));
};
exports.GhostPingRole = GhostPingRole;
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
