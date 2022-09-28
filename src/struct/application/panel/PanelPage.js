"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanelPage = void 0;
const __1 = require("../../..");
const AplikoEmbed_ts_1 = require("../../../util/conversion/AplikoEmbed.ts");
class PanelPage {
    constructor(client) {
        this._client = client;
        this._requireGuild = false;
        this._requirdPermissions = [];
        this.buttonCallbacks = new Map();
        this.dropdownCallbacks = new Map();
        this.modalCallbacks = new Map();
        this.configure();
    }
    configure() {
    }
    constructSkeleton(context) {
        return undefined;
    }
    async construct(context, skeleton) {
        return skeleton || PanelPage.defaultPageContent;
    }
    async checkPrereqs(interaction) {
        if (this._requireGuild && !interaction.guildId)
            return {
                success: false,
                message: 'that menu can only be opened in a guild.'
            };
        if (this._requirdPermissions.length > 0) {
            const member = await (0, __1.$ftm)('Err-Menu-Prereq-01', this.client.findMember(interaction.guildId, interaction.user.id));
            for (const permission of this._requirdPermissions) {
                if (!member.permissions.has(permission))
                    return {
                        success: false,
                        message: `You don't have the permissions required to open that menu`
                    };
            }
        }
        return { success: true };
    }
    async onModal(context) {
        await this.modalCallbacks.get(context.interaction.getCustomId())?.apply(this, [context]);
    }
    async onButton(context) {
        await this.buttonCallbacks.get(context.interaction.customId)?.apply(this, [context]);
    }
    async onSelect(context) {
        await this.dropdownCallbacks.get(context.interaction.customId)?.apply(this, [context]);
    }
    requireGuild() {
        this._requireGuild = true;
    }
    requirePermission(permission) {
        this._requireGuild = true;
        this._requirdPermissions.push(permission);
    }
    get client() {
        return this._client;
    }
}
exports.PanelPage = PanelPage;
PanelPage.defaultPageContent = {
    embeds: [
        {
            style: AplikoEmbed_ts_1.AplikoEmbedStyle.ERROR,
            description: 'Page not configured.'
        }
    ],
    components: []
};
