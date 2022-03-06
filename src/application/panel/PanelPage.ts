import { Client, PageContent } from '../..';
import { CallbackHandler } from '../../decorator/callback/RegisterCallbacks';
import { ComponentInteractionDataModel } from '../../struct/apliko/ComponentInteractionData';
import {
    ButtonInteractionContext,
    ModalInteractionContext,
    SelectMenuInteractionContext,
} from '../../struct/apliko/Contexts';
import { AplikoEmbed, AplikoEmbedStyle } from '../../util/conversion/AplikoEmbed.ts';
import {
    PanelButtonInteractionContext,
    PanelContext,
    PanelModalInteractionContext,
    PanelSelectMenuInteractionContext,
} from './PanelContext';

export abstract class PanelPage implements CallbackHandler {
    private _client: Client;

    public buttonCallbacks: Map<string, (context: ButtonInteractionContext) => Promise<any>>;
    public selectCallbacks: Map<string, (context: SelectMenuInteractionContext) => Promise<any>>;
    public modalCallbacks: Map<string, (context: ModalInteractionContext) => Promise<any>>;

    public constructor(client: Client) {
        this._client = client;
        this.buttonCallbacks = new Map();
        this.selectCallbacks = new Map();
        this.modalCallbacks = new Map();
    }

    public async constructPage(context: PanelContext): Promise<PageContent> {
        return {
            embeds: [
                <AplikoEmbed>{
                    style: AplikoEmbedStyle.ERROR,
                    description: 'Page not configured.'
                }
            ],
            components: []
        };
    }

    public async onModal(context: PanelModalInteractionContext, data: ComponentInteractionDataModel) {
        this.modalCallbacks.get(data.componentId)?.apply(this, [context]);
    }

    public async onButton(context: PanelButtonInteractionContext, data: ComponentInteractionDataModel) {
        this.buttonCallbacks.get(data.componentId)?.apply(this, [context]);
    }

    public async onSelect(context: PanelSelectMenuInteractionContext, data: ComponentInteractionDataModel) {
        this.selectCallbacks.get(data.componentId)?.apply(this, [context]);
    }

    get client() {
        return this._client;
    }
}
