import { ButtonInteractionContext, Client, DropdownInteractionContext, ModalInteractionContext, PageContent, RespondableInteraction } from '../../..';
import { CallbackHandler } from '../../../decorator/RegisterCallbacks';
import { PanelButtonInteractionContext, PanelContext, PanelDropdownInteractionContext, PanelModalInteractionContext } from './PanelContext';
import { PermissionString } from "discord.js";
export declare abstract class PanelPage implements CallbackHandler {
    private _client;
    _requireGuild: boolean;
    _requirdPermissions: PermissionString[];
    buttonCallbacks: Map<string, (context: ButtonInteractionContext) => Promise<any>>;
    dropdownCallbacks: Map<string, (context: DropdownInteractionContext) => Promise<any>>;
    modalCallbacks: Map<string, (context: ModalInteractionContext) => Promise<any>>;
    static defaultPageContent: PageContent;
    constructor(client: Client);
    configure(): void;
    constructSkeleton(context: PanelContext): PageContent | undefined;
    construct(context: PanelContext, skeleton?: PageContent): Promise<PageContent | undefined>;
    checkPrereqs(interaction: RespondableInteraction): Promise<{
        success: boolean;
        message?: string;
    }>;
    onModal(context: PanelModalInteractionContext): Promise<void>;
    onButton(context: PanelButtonInteractionContext): Promise<void>;
    onSelect(context: PanelDropdownInteractionContext): Promise<void>;
    protected requireGuild(): void;
    protected requirePermission(permission: PermissionString): void;
    get client(): Client;
}
