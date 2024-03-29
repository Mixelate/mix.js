import { Guild, GuildMember, InteractionWebhook, TextBasedChannel, User } from 'discord.js';
import { Client } from '../../../..';
import { ApiBaseInteraction } from '../../../..';
export declare class BaseInteraction {
    private readonly client;
    private readonly webhook;
    private readonly id;
    private readonly token;
    private readonly guildId?;
    private readonly channelId?;
    private readonly userId?;
    private readonly userName?;
    private readonly messageId?;
    constructor(client: Client, data: ApiBaseInteraction);
    fetchGuild(): Promise<Guild>;
    resolveGuild(): Promise<Guild>;
    fetchUser(): Promise<User>;
    resolveUser(): Promise<User>;
    fetchMember(): Promise<GuildMember>;
    resolveMember(): Promise<GuildMember>;
    fetchTextChannel(): Promise<TextBasedChannel>;
    resolveTextChannel(): Promise<TextBasedChannel>;
    getClient(): Client;
    getWebhook(): InteractionWebhook;
    getId(): string;
    getToken(): string;
    getGuildId(): string | undefined;
    getChannelId(): string | undefined;
    getUserId(): string | undefined;
    getMessageId(): string | undefined;
}
