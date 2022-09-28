"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const rest_1 = require("@discordjs/rest");
const discord_js_1 = require("discord.js");
const events_1 = __importDefault(require("events"));
const CollectorManager_1 = require("./manager/CollectorManager");
const CommandManager_1 = require("./manager/CommandManager");
const ControllerManager_1 = require("./manager/ControllerManager");
const PanelManager_1 = require("./manager/PanelManager");
const ApiModalInteraction_1 = require("./struct/discord/interactions/api/ApiModalInteraction");
const ModalSubmitInteraction_1 = require("./struct/discord/interactions/parser/ModalSubmitInteraction");
class Client extends events_1.default {
    constructor(options) {
        super();
        this.options = options;
        this.discordClient = new discord_js_1.Client({ intents: options.intents || [] });
        this.rest = new rest_1.REST().setToken(this.options.token);
        this.commandManager = new CommandManager_1.CommandManager(this);
        this.panelManager = new PanelManager_1.PanelManager(this);
        this.controllerManager = new ControllerManager_1.ControllerManager(this);
        this.collectorManager = new CollectorManager_1.CollectorManager(this);
        this.allowedGuilds = options.allowGuilds;
        this.ignoredGuilds = options.ignoreGuilds;
        this.discordClient.on('ready', this.onReady.bind(this));
        this.discordClient.on('interactionCreate', this.onInteraction.bind(this));
        this.discordClient.on('messageCreate', this.onMessage.bind(this));
        this.discordClient.ws.on('INTERACTION_CREATE', this.onWebsocketInteraction.bind(this));
        console.log('Initialized a client');
    }
    async login() {
        await this.discordClient.login(this.options.token);
        this.emit('ready');
    }
    async onReady() {
        console.log(`A client logged in as ${this.discordClient.user.username}`);
    }
    async onWebsocketInteraction(interaction) {
        if (!interaction.guild_id)
            return;
        if (!(0, ApiModalInteraction_1.IsApiModalInteraction)(interaction))
            return;
        if (this.shouldHandleGuild(interaction.guild_id))
            this.emit('wsInteractionCreate', new ModalSubmitInteraction_1.ModalSubmitInteraction(this, interaction));
    }
    async onInteraction(interaction) {
        if (!interaction.guildId)
            return;
        if (this.shouldHandleGuild(interaction.guildId))
            this.emit('interactionCreate', interaction);
    }
    async onMessage(message) {
        if (!message.guildId)
            return;
        if (this.shouldHandleGuild(message.guildId))
            this.emit('messageCreate', message);
    }
    getCachedGuilds() {
        return this.discordClient.guilds.cache.filter((guild) => this.shouldHandleGuild(guild.id)).map((guild) => guild);
    }
    async fetchGuilds() {
        return (await this.discordClient.guilds
            .fetch()
            .then((guilds) => guilds.filter((guild) => this.shouldHandleGuild(guild.id)))
            .then((guilds) => guilds.map((guild) => this.discordClient.guilds.resolve(guild.id)))
            .then((guilds) => guilds.filter((guild) => guild != null))
            .then((guilds) => guilds.map((guild) => guild)));
    }
    getCachedGuild(guildId) {
        if (!this.shouldHandleGuild(guildId))
            return;
        return this.discordClient.guilds.cache.find((guild) => guild.id === guildId);
    }
    async fetchGuild(guildId) {
        if (!this.shouldHandleGuild(guildId))
            return null;
        return await this.discordClient.guilds.fetch(guildId).then((guild) => this.discordClient.guilds.resolve(guild.id));
    }
    async findGuild(guildId) {
        const cached = this.getCachedGuild(guildId);
        if (cached)
            return cached;
        return await this.fetchGuild(guildId);
    }
    getCachedMember(guildId, memberId) {
        return this.discordClient.guilds.resolve(guildId)?.members.resolve(memberId) || null;
    }
    async fetchMember(guildId, memberId) {
        return await this.discordClient.guilds
            .fetch(guildId)
            .then((guild) => this.discordClient.guilds.resolve(guild.id))
            .then(async (guild) => {
            return { guild, member: await guild.members.fetch(memberId) };
        })
            .then(({ guild, member }) => guild.members.resolve(member.id));
    }
    async findMember(guildId, memberId) {
        const cached = this.getCachedMember(guildId, memberId);
        if (cached)
            return cached;
        return await this.fetchMember(guildId, memberId).catch(_ => null);
    }
    getCachedChannel(guildId, channelId) {
        return this.discordClient.guilds.resolve(guildId)?.channels.resolve(channelId) || null;
    }
    async fetchChannel(guildId, channelId) {
        return await this.discordClient.guilds
            .fetch(guildId)
            .then((guild) => this.discordClient.guilds.resolve(guild.id))
            .then(async (guild) => {
            return { guild, channel: await guild.channels.fetch(channelId) };
        })
            .then(({ guild, channel }) => guild.channels.resolve(channelId));
    }
    async findChannel(guildId, channelId) {
        const cached = this.getCachedChannel(guildId, channelId);
        if (cached)
            return cached;
        return await this.fetchChannel(guildId, channelId).catch(_ => null);
    }
    getCachedMessage(guildId, messageId) {
        const guild = this.discordClient.guilds.resolve(guildId);
        if (!guild)
            return null;
        const textChannels = guild.channels.cache.filter(channel => channel instanceof discord_js_1.TextChannel);
        if (textChannels.size === 0)
            return null;
        for (const [_, channel] of textChannels) {
            const message = channel.messages.cache.get(messageId);
            if (message)
                return message;
        }
        return null;
    }
    async fetchMessage(guildId, messageId) {
        const guild = await this.discordClient.guilds.fetch(guildId)
            .then(guild => this.discordClient.guilds.resolve(guildId))
            .catch(_ => null);
        if (!guild)
            return null;
        const textChannels = await guild.channels.fetch()
            .then(channels => channels.map(channel => guild.channels.resolve(channel)))
            .then(channels => channels.filter(channel => channel instanceof discord_js_1.TextChannel));
        if (!textChannels || textChannels.size === 0)
            return null;
        for (const channel of textChannels.values()) {
            const message = await channel.messages.fetch(messageId)
                .then(message => channel.messages.resolve(messageId))
                .catch(_ => null);
            if (message)
                return message;
        }
        return null;
    }
    async findMessage(guildId, messageId) {
        const cached = this.getCachedMessage(guildId, messageId);
        if (cached)
            return cached;
        return await this.fetchMessage(guildId, messageId);
    }
    ignoreGuilds(...guilds) {
        if (this.allowedGuilds)
            this.allowedGuilds = this.allowedGuilds.filter((guild) => !guilds.includes(guild));
        if (!this.ignoredGuilds)
            return (this.ignoredGuilds = guilds);
        this.ignoredGuilds.push(...guilds);
    }
    allowGuilds(...guilds) {
        if (this.ignoredGuilds)
            this.ignoredGuilds = this.ignoredGuilds.filter((guild) => !guilds.includes(guild));
    }
    shouldHandleGuild(guildId) {
        if (this.ignoredGuilds && this.ignoredGuilds.includes(guildId))
            return false;
        if (this.allowedGuilds && !this.allowedGuilds.includes(guildId))
            return false;
        return true;
    }
}
exports.Client = Client;
