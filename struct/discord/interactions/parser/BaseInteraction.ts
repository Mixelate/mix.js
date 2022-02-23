import { AnyChannel, Guild, GuildMember, InteractionWebhook, TextBasedChannel, User } from 'discord.js';

import { AplikoBot } from '../../../../Bot';
import { $falsyThrow } from '../../../../util';
import { AplikoError } from '../AplikoError';
import { ApiBaseInteraction } from '../data';

export class BaseInteraction {

    private readonly bot: AplikoBot;
    private readonly webhook: InteractionWebhook;
    private readonly id: string;
    private readonly token: string;
    private readonly guildId?: string;
    private readonly channelId: string;
    private readonly userId?: string;

    constructor(bot: AplikoBot, data: ApiBaseInteraction) {
        this.bot = bot;
        this.webhook = new InteractionWebhook(bot.client, data.application_id, data.token);
        this.id = data.id;
        this.token = data.token;
        this.guildId = data.guild_id
        this.channelId = data.channel_id;
        this.userId = data.member?.user.id;

        // Fetch and cache entities
        this.fetchGuild().catch(() => { });
        this.fetchUser().catch(() => { });
        this.fetchMember().catch(() => { });
        this.fetchTextChannel().catch(() => { });
    }

    public async fetchGuild(): Promise<Guild> {
        if (!this.guildId)
            throw new AplikoError(`Guild data was not included in the interaction data`);

        return $falsyThrow!(
            `Failed to fetch guild`,
            await this.bot.client.guilds.fetch(this.guildId)
        ) as Guild;
    }

    public async resolveGuild(): Promise<Guild> {
        if (!this.guildId)
            throw new AplikoError(`Guild data was not included in the interaction data`);

        return $falsyThrow!(
            `Failed to resolve guild`,
            this.bot.client.guilds.resolve(this.guildId)
        )
    }

    public async fetchUser(): Promise<User> {
        if (!this.userId)
            throw new AplikoError(`User data was not included in the interaction data`);

        return $falsyThrow!(
            `Failed to fetch user`,
            await this.bot.client.users.fetch(this.userId)
        ) as User;
    }

    public async resolveUser(): Promise<User> {
        if (!this.userId)
            throw new AplikoError(`User data was not included in the interaction data`);

        return $falsyThrow!(
            `Failed to resolve user`,
            this.bot.client.users.resolve(this.userId)
        )
    }

    public async fetchMember(): Promise<GuildMember> {
        if (!this.userId)
            throw new AplikoError(`User data was not included in the interaction data`);

        const guild = await this.fetchGuild();

        return $falsyThrow!(
            `Failed to fetch member`,
            await guild.members.fetch(this.userId)
        ) as GuildMember;
    }

    public async resolveMember(): Promise<GuildMember> {
        if (!this.userId)
            throw new AplikoError(`User data was not included in the interaction data`);

        const guild = await this.resolveGuild();

        return $falsyThrow!(
            `Failed to resolve member`,
            guild.members.resolve(this.userId)
        )
    }

    public async fetchTextChannel(): Promise<TextBasedChannel> {
        return $falsyThrow!(
            `Failed to fetch channel`,
            await this.bot.client.channels.fetch(this.channelId)
        ) as TextBasedChannel;
    }

    public async resolveTextChannel(): Promise<TextBasedChannel> {
        return $falsyThrow!(
            `Failed to resolve channel`,
            this.bot.client.channels.resolve(this.channelId)
        ) as TextBasedChannel;
    }

    public getBot() {
        return this.bot;
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

}
