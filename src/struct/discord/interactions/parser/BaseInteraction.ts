import { AnyChannel, Guild, GuildMember, InteractionWebhook, TextBasedChannel, User } from 'discord.js';

import { $sftm, Client } from '../../../..';
import { AplikoError } from '../../../error/AplikoError';
import { ApiBaseInteraction } from '../../../..';

export class BaseInteraction {
    private readonly client: Client;
    private readonly webhook: InteractionWebhook;
    private readonly id: string;
    private readonly token: string;
    private readonly guildId?: string;
    private readonly channelId?: string;
    private readonly userId?: string;
    private readonly userName?: string;
    private readonly messageId?: string;

    constructor(client: Client, data: ApiBaseInteraction) {
        this.client = client;
        this.webhook = new InteractionWebhook(client.discordClient, data.application_id, data.token);
        this.id = data.id;
        this.token = data.token;
        this.guildId = data.guild_id;
        this.channelId = data.channel_id;
        this.userId = data.member?.user.id;
        this.userName = data.member?.user.username
        this.messageId = data.message?.id;

        // Fetch and cache entities
        this.fetchGuild().catch(() => {});
        this.fetchUser().catch(() => {});
        this.fetchMember().catch(() => {});
        this.fetchTextChannel().catch(() => {});
    }

    // TODO: Use client guild fetching in all of these

    public async fetchGuild(): Promise<Guild> {
        if (!this.guildId) throw new AplikoError(`Guild data was not included in the interaction data`);

        return $sftm!(`Failed to fetch guild`, await this.client.discordClient.guilds.fetch(this.guildId)) as Guild;
    }

    public async resolveGuild(): Promise<Guild> {
        if (!this.guildId) throw new AplikoError(`Guild data was not included in the interaction data`);

        return $sftm!(`Failed to resolve guild`, this.client.discordClient.guilds.resolve(this.guildId));
    }

    public async fetchUser(): Promise<User> {
        if (!this.userId) throw new AplikoError(`User data was not included in the interaction data`);

        return $sftm!(`Failed to fetch user`, await this.client.discordClient.users.fetch(this.userId)) as User;
    }

    public async resolveUser(): Promise<User> {
        if (!this.userId) throw new AplikoError(`User data was not included in the interaction data`);

        return $sftm!(`Failed to resolve user`, this.client.discordClient.users.resolve(this.userId));
    }

    public async fetchMember(): Promise<GuildMember> {
        if (!this.userId) throw new AplikoError(`User data was not included in the interaction data`);

        const guild = await this.fetchGuild();

        return $sftm!(`Failed to fetch member`, await guild.members.fetch(this.userId)) as GuildMember;
    }

    public async resolveMember(): Promise<GuildMember> {
        if (!this.userId) throw new AplikoError(`User data was not included in the interaction data`);

        const guild = await this.resolveGuild();

        return $sftm!(`Failed to resolve member`, guild.members.resolve(this.userId));
    }

    public async fetchTextChannel(): Promise<TextBasedChannel> {
        return $sftm!(`Failed to fetch channel`, await this.client.discordClient.channels.fetch(this.channelId!)) as TextBasedChannel;
    }

    public async resolveTextChannel(): Promise<TextBasedChannel> {
        return $sftm!(`Failed to resolve channel`, this.client.discordClient.channels.resolve(this.channelId!)) as TextBasedChannel;
    }

    public getClient() {
        return this.client;
    }

    public getWebhook() {
        return this.webhook;
    }

    public getId() {
        return this.id;
    }

    public getToken() {
        return this.token;
    }

    public getGuildId() {
        return this.guildId;
    }

    public getChannelId() {
        return this.channelId;
    }

    public getUserId() {
        return this.userId;
    }

    public getMessageId() {
        return this.messageId;
    }
}
