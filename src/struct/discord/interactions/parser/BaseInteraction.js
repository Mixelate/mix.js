"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseInteraction = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("../../../..");
const AplikoError_1 = require("../../../error/AplikoError");
class BaseInteraction {
    constructor(client, data) {
        this.client = client;
        this.webhook = new discord_js_1.InteractionWebhook(client.discordClient, data.application_id, data.token);
        this.id = data.id;
        this.token = data.token;
        this.guildId = data.guild_id;
        this.channelId = data.channel_id;
        this.userId = data.member?.user.id;
        this.userName = data.member?.user.username;
        this.messageId = data.message?.id;
        // Fetch and cache entities
        this.fetchGuild().catch(() => { });
        this.fetchUser().catch(() => { });
        this.fetchMember().catch(() => { });
        this.fetchTextChannel().catch(() => { });
    }
    // TODO: Use client guild fetching in all of these
    async fetchGuild() {
        if (!this.guildId)
            throw new AplikoError_1.AplikoError(`Guild data was not included in the interaction data`);
        return __1.$sftm(`Failed to fetch guild`, await this.client.discordClient.guilds.fetch(this.guildId));
    }
    async resolveGuild() {
        if (!this.guildId)
            throw new AplikoError_1.AplikoError(`Guild data was not included in the interaction data`);
        return __1.$sftm(`Failed to resolve guild`, this.client.discordClient.guilds.resolve(this.guildId));
    }
    async fetchUser() {
        if (!this.userId)
            throw new AplikoError_1.AplikoError(`User data was not included in the interaction data`);
        return __1.$sftm(`Failed to fetch user`, await this.client.discordClient.users.fetch(this.userId));
    }
    async resolveUser() {
        if (!this.userId)
            throw new AplikoError_1.AplikoError(`User data was not included in the interaction data`);
        return __1.$sftm(`Failed to resolve user`, this.client.discordClient.users.resolve(this.userId));
    }
    async fetchMember() {
        if (!this.userId)
            throw new AplikoError_1.AplikoError(`User data was not included in the interaction data`);
        const guild = await this.fetchGuild();
        return __1.$sftm(`Failed to fetch member`, await guild.members.fetch(this.userId));
    }
    async resolveMember() {
        if (!this.userId)
            throw new AplikoError_1.AplikoError(`User data was not included in the interaction data`);
        const guild = await this.resolveGuild();
        return __1.$sftm(`Failed to resolve member`, guild.members.resolve(this.userId));
    }
    async fetchTextChannel() {
        return __1.$sftm(`Failed to fetch channel`, await this.client.discordClient.channels.fetch(this.channelId));
    }
    async resolveTextChannel() {
        return __1.$sftm(`Failed to resolve channel`, this.client.discordClient.channels.resolve(this.channelId));
    }
    getClient() {
        return this.client;
    }
    getWebhook() {
        return this.webhook;
    }
    getId() {
        return this.id;
    }
    getToken() {
        return this.token;
    }
    getGuildId() {
        return this.guildId;
    }
    getChannelId() {
        return this.channelId;
    }
    getUserId() {
        return this.userId;
    }
    getMessageId() {
        return this.messageId;
    }
}
exports.BaseInteraction = BaseInteraction;
