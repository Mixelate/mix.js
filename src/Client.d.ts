/// <reference types="node" />
import { REST } from '@discordjs/rest';
import { BitFieldResolvable, Channel, Client as DiscordClient, ColorResolvable, Guild, GuildMember, IntentsString, Interaction, Message } from 'discord.js';
import EventEmitter from 'events';
import { CollectorManager } from './manager/CollectorManager';
import { CommandManager } from './manager/CommandManager';
import { ControllerManager } from './manager/ControllerManager';
import { PanelManager } from './manager/PanelManager';
import { ApiBaseInteraction } from './struct/discord/interactions/api/ApiBaseInteraction';
export declare class Client extends EventEmitter {
    readonly options: ClientOptions;
    private ignoredGuilds?;
    private allowedGuilds?;
    readonly discordClient: DiscordClient;
    readonly rest: REST;
    readonly commandManager: CommandManager;
    readonly panelManager: PanelManager;
    readonly controllerManager: ControllerManager;
    readonly collectorManager: CollectorManager;
    constructor(options: ClientOptions);
    login(): Promise<void>;
    private onReady;
    onWebsocketInteraction(interaction: ApiBaseInteraction): Promise<void>;
    onInteraction(interaction: Interaction): Promise<void>;
    onMessage(message: Message): Promise<void>;
    getCachedGuilds(): Guild[];
    fetchGuilds(): Promise<Guild[]>;
    getCachedGuild(guildId: string): Guild | undefined;
    fetchGuild(guildId: string): Promise<Guild | null>;
    findGuild(guildId: string): Promise<Guild | null>;
    getCachedMember(guildId: string, memberId: string): GuildMember | null;
    fetchMember(guildId: string, memberId: string): Promise<GuildMember | null>;
    findMember(guildId: string, memberId: string): Promise<GuildMember | null>;
    getCachedChannel(guildId: string, channelId: string): Channel | null;
    fetchChannel(guildId: string, channelId: string): Promise<Channel | null>;
    findChannel(guildId: string, channelId: string): Promise<Channel | null>;
    getCachedMessage(guildId: string, messageId: string): Message | null;
    fetchMessage(guildId: string, messageId: string): Promise<Message | null>;
    findMessage(guildId: string, messageId: string): Promise<Message | null>;
    ignoreGuilds(...guilds: string[]): string[] | undefined;
    allowGuilds(...guilds: string[]): void;
    shouldHandleGuild(guildId: string): boolean;
}
export interface ClientOptions {
    id?: string;
    token: string;
    intents?: BitFieldResolvable<IntentsString, number>;
    ignoreGuilds?: string[];
    allowGuilds?: string[];
    apprearance?: {
        embedPrimaryColor?: ColorResolvable;
    };
}
