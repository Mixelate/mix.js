import { $ftm, ButtonInteractionContext, Client, DropdownInteractionContext, ModalInteractionContext, PageContent, RespondableInteraction } from '../../..';
import { CallbackHandler } from '../../../decorator/RegisterCallbacks';
import { AplikoEmbed, AplikoEmbedStyle } from '../../../util/conversion/AplikoEmbed.ts';
import { PanelButtonInteractionContext, PanelContext, PanelDropdownInteractionContext, PanelModalInteractionContext } from './PanelContext';
import { PermissionString } from "discord.js";


export abstract class PanelPage implements CallbackHandler {

    private _client: Client;

    public _requireGuild: boolean;
    public _requirdPermissions: PermissionString[];

    public buttonCallbacks: Map<string, (context: ButtonInteractionContext) => Promise<any>>;
    public dropdownCallbacks: Map<string, (context: DropdownInteractionContext) => Promise<any>>;
    public modalCallbacks: Map<string, (context: ModalInteractionContext) => Promise<any>>;

    public static defaultPageContent: PageContent = {
        embeds: [
            <AplikoEmbed>{
                style: AplikoEmbedStyle.ERROR,
                description: 'Page not configured.'
            }
        ],
        components: []
    }

    public constructor(client: Client) {
        this._client = client;
        this._requireGuild = false;
        this._requirdPermissions = [];
        this.buttonCallbacks = new Map();
        this.dropdownCallbacks = new Map();
        this.modalCallbacks = new Map();
        this.configure();
    }

    public configure() {

    }

    public constructSkeleton(context: PanelContext): PageContent | undefined {
        return undefined;
    }

    public async construct(context: PanelContext, skeleton?: PageContent): Promise<PageContent | undefined> {
        return skeleton || PanelPage.defaultPageContent;
    }

    public async checkPrereqs(interaction: RespondableInteraction): Promise<{
        success: boolean,
        message?: string
    }> {
        if (this._requireGuild && !interaction.guildId)
            return {
                success: false,
                message: 'that menu can only be opened in a guild.'
            };

        if (this._requirdPermissions.length > 0) {
            const member = await $ftm('Err-Menu-Prereq-01',
                this.client.findMember(interaction.guildId!, interaction.user.id)
            );

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

    public async onModal(context: PanelModalInteractionContext) {
        await this.modalCallbacks.get(context.interaction.getCustomId())?.apply(this, [context]);
    }

    public async onButton(context: PanelButtonInteractionContext) {
        await this.buttonCallbacks.get(context.interaction.customId)?.apply(this, [context]);
    }

    public async onSelect(context: PanelDropdownInteractionContext) {
        await this.dropdownCallbacks.get(context.interaction.customId)?.apply(this, [context]);
    }

    protected requireGuild() {
        this._requireGuild = true;
    }

    protected requirePermission(permission: PermissionString) {
        this._requireGuild = true;
        this._requirdPermissions.push(permission);
    }

    get client() {
        return this._client;
    }
}
