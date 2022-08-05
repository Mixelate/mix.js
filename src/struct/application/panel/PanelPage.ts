import { ButtonInteractionContext, Client, DropdownInteractionContext, ModalInteractionContext, PageContent } from '../../..';
import { CallbackHandler } from '../../../decorator/RegisterCallbacks';
import { ComponentInteractionDataModel } from '../../../util/ComponentInteractionData';
import { AplikoEmbed, AplikoEmbedStyle } from '../../../util/conversion/AplikoEmbed.ts';
import { PanelButtonInteractionContext, PanelContext, PanelDropdownInteractionContext, PanelModalInteractionContext } from '../../../struct/application/panel/PanelContext';

export abstract class PanelPage implements CallbackHandler {

    private _client: Client;
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
        this.buttonCallbacks = new Map();
        this.dropdownCallbacks = new Map();
        this.modalCallbacks = new Map();
    }

    public constructSkeleton(context: PanelContext): PageContent | undefined {
        return undefined;
    }

    public async constructPage(context: PanelContext): Promise<PageContent | undefined> {
        return PanelPage.defaultPageContent;
    }

    public async loadDynamicContent(context: PanelContext) {
        
    }

    public async onModal(context: PanelModalInteractionContext, data: ComponentInteractionDataModel) {
        await this.modalCallbacks.get(data.componentId)?.apply(this, [context]);
    }

    public async onButton(context: PanelButtonInteractionContext, data: ComponentInteractionDataModel) {
        await this.buttonCallbacks.get(data.componentId)?.apply(this, [context]);
    }

    public async onSelect(context: PanelDropdownInteractionContext, data: ComponentInteractionDataModel) {
        await this.dropdownCallbacks.get(data.componentId)?.apply(this, [context]);
    }

    get client() {
        return this._client;
    }
}
