import { REST } from '@discordjs/rest';
import {
    BitFieldResolvable,
    Channel,
    Client as DiscordClient,
    Collection,
    ColorResolvable,
    Guild,
    GuildMember,
    IntentsString,
    Interaction,
    Message,
    ShardingManager,
    TextChannel,
} from 'discord.js';
import EventEmitter from 'events';

import { ControllerManager, PanelManager } from '..';
import { CollectorManager } from './manager/CollectorManager';
import { CommandManager } from './manager/CommandManager';
import { ApiBaseInteraction } from './struct/discord/interactions/api/ApiBaseInteraction';
import { ApiModalSubmitInteraction, IsApiModalInteraction } from './struct/discord/interactions/api/ApiModalInteraction';
import { InteractionType } from './struct/discord/interactions/enum/InteractionType';
import { ModalSubmitInteraction } from './struct/discord/interactions/parser/ModalSubmitInteraction';

export class Client extends EventEmitter {
    private ignoredGuilds?: string[];
    private allowedGuilds?: string[];

    public readonly options: ClientOptions;
    public readonly discordClient: DiscordClient;
    public readonly rest: REST;
    public readonly commandManager: CommandManager;
    public readonly panelManager: PanelManager;
    public readonly controllerManager: ControllerManager;
    public readonly collectorManager: CollectorManager;

    public constructor(options: ClientOptions) {
        super();
        this.options = options;
        this.discordClient = new DiscordClient({ intents: options.intents || [] });
        this.rest = new REST().setToken(this.options.token);
        this.commandManager = new CommandManager(this);
        this.panelManager = new PanelManager(this);
        this.controllerManager = new ControllerManager(this);
        this.collectorManager = new CollectorManager(this);
        
        this.allowedGuilds = options.allowGuilds;
        this.ignoredGuilds = options.ignoreGuilds;

        this.discordClient.on('ready', this.onReady.bind(this));
        this.discordClient.on('interactionCreate', this.onInteraction.bind(this))
        this.discordClient.on('messageCreate', this.onMessage.bind(this))
        this.discordClient.ws.on('INTERACTION_CREATE', this.onWebsocketInteraction.bind(this));
        console.log('Initialized a client')
    }

    public async login() {
        await this.discordClient.login(this.options.token);
        this.emit('ready');
    }

    private async onReady() {
        console.log(`A client logged in as ${this.discordClient.user!.username}`);
    }

    public async onWebsocketInteraction(interaction: ApiBaseInteraction) {
        if (!interaction.guild_id)
            return;

        if (!IsApiModalInteraction(interaction))
            return;

        if (this.shouldHandleGuild(interaction.guild_id))
            this.emit('wsInteractionCreate', new ModalSubmitInteraction(this, interaction as ApiModalSubmitInteraction))
    }

    public async onInteraction(interaction: Interaction) {
        if (!interaction.guildId)
            return;

        if (this.shouldHandleGuild(interaction.guildId))
            this.emit('interactionCreate', interaction)
    }

    public async onMessage(message: Message) {
        if (!message.guildId)
            return;

        if (this.shouldHandleGuild(message.guildId))
            this.emit('messageCreate', message)
    }

    public getCachedGuilds(): Guild[] {
        return this.discordClient.guilds.cache.filter((guild) => this.shouldHandleGuild(guild.id)).map((guild) => guild);
    }

    public async fetchGuilds(): Promise<Guild[]> {
        return (await this.discordClient.guilds
            .fetch()
            .then((guilds) => guilds.filter((guild) => this.shouldHandleGuild(guild.id)))
            .then((guilds) => guilds.map((guild) => this.discordClient.guilds.resolve(guild.id)))
            .then((guilds) => guilds.filter((guild) => guild != null))
            .then((guilds) => guilds.map((guild) => guild))) as Guild[];
    }

    public getCachedGuild(guildId: string): Guild | undefined {
        if (!this.shouldHandleGuild(guildId)) return;

        return this.discordClient.guilds.cache.find((guild) => guild.id === guildId);
    }

    public async fetchGuild(guildId: string): Promise<Guild | null> {
        if (!this.shouldHandleGuild(guildId)) return null;

        return await this.discordClient.guilds.fetch(guildId).then((guild) => this.discordClient.guilds.resolve(guild.id));
    }

    public async findGuild(guildId: string): Promise<Guild | null> {
        const cached = this.getCachedGuild(guildId);

        if (cached) return cached;

        return await this.fetchGuild(guildId);
    }

    public getCachedMember(guildId: string, memberId: string): GuildMember | null {
        return this.discordClient.guilds.resolve(guildId)?.members.resolve(memberId) || null;
    }

    public async fetchMember(guildId: string, memberId: string): Promise<GuildMember | null> {
        return await this.discordClient.guilds
            .fetch(guildId)
            .then((guild) => this.discordClient.guilds.resolve(guild.id)!)
            .then(async (guild) => {
                return { guild, member: await guild.members.fetch(memberId) };
            })
            .then(({ guild, member }) => guild.members.resolve(member.id));
    }

    public async findMember(guildId: string, memberId: string): Promise<GuildMember | null> {
        const cached = this.getCachedMember(guildId, memberId);

        if (cached) return cached;

        return await this.fetchMember(guildId, memberId).catch(_ => null);
    }

    public getCachedChannel(guildId: string, channelId: string): Channel | null {
        return this.discordClient.guilds.resolve(guildId)?.channels.resolve(channelId) || null;
    }

    public async fetchChannel(guildId: string, channelId: string): Promise<Channel | null> {
        return await this.discordClient.guilds
            .fetch(guildId)
            .then((guild) => this.discordClient.guilds.resolve(guild.id)!)
            .then(async (guild) => {
                return { guild, channel: await guild.channels.fetch(channelId) };
            })
            .then(({ guild, channel }) => guild.channels.resolve(channelId));
    }

    public async findChannel(guildId: string, channelId: string): Promise<Channel | null> {
        const cached = this.getCachedChannel(guildId, channelId);
        
        if (cached) return cached;

        return await this.fetchChannel(guildId, channelId).catch(_ => null);
    }

    public getCachedMessage(guildId: string, messageId: string): Message | null {
        const guild = this.discordClient.guilds.resolve(guildId)
        if (!guild) return null;

        const textChannels = guild.channels.cache.filter(channel =>
            channel instanceof TextChannel) as Collection<string, TextChannel>

        if (textChannels.size === 0) return null;

        for (const [_, channel] of textChannels) {
            const message = channel.messages.cache.get(messageId)
            if (message) return message;
        }

        return null;
    }

    public async fetchMessage(guildId: string, messageId: string): Promise<Message | null> {
        const guild = await this.discordClient.guilds.fetch(guildId)
            .then(guild => this.discordClient.guilds.resolve(guildId))
            .catch(_ => null)

        if (!guild) return null;

        const textChannels = await guild.channels.fetch()
            .then(channels => channels.map(channel => guild.channels.resolve(channel)))
            .then(channels => channels.filter(channel => channel instanceof TextChannel)) as
                Collection<string, TextChannel>

        if (!textChannels || textChannels.size === 0) return null;

        for (const channel of textChannels.values()) {
            const message = await channel.messages.fetch(messageId)
                .then(message => channel.messages.resolve(messageId))
                .catch(_ => null)
    
            if (message) return message;
        }

        return null;
    }

    public async findMessage(guildId: string, messageId: string): Promise<Message | null> {
        const cached = this.getCachedMessage(guildId, messageId);

        if (cached) return cached;

        return await this.fetchMessage(guildId, messageId);
    }

    public ignoreGuilds(...guilds: string[]) {
        if (this.allowedGuilds) this.allowedGuilds = this.allowedGuilds.filter((guild) => !guilds.includes(guild));

        if (!this.ignoredGuilds) return (this.ignoredGuilds = guilds);

        this.ignoredGuilds.push(...guilds);
    }

    public allowGuilds(...guilds: string[]) {
        if (this.ignoredGuilds) this.ignoredGuilds = this.ignoredGuilds.filter((guild) => !guilds.includes(guild));
    }

    public shouldHandleGuild(guildId: string): boolean {
        if (this.ignoredGuilds && this.ignoredGuilds.includes(guildId)) return false;

        if (this.allowedGuilds && !this.allowedGuilds.includes(guildId)) return false;

        return true;
    }
}

// TODO: Add more options from BaseClient
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