import { Client, PageContent } from '../../..';
import { CallbackHandler } from '../../../decorator/RegisterCallbacks';
import { ComponentInteractionDataModel } from '../../../util/ComponentInteractionData';
import { AplikoEmbed, AplikoEmbedStyle } from '../../../util/conversion/AplikoEmbed.ts';
import PanelContext, { PanelButtonInteractionContext, PanelDropdownInteractionContext, PanelModalInteractionContext } from 'struct/application/panel/PanelContext';
import ButtonInteractionContext from 'struct/context/ButtonInteractionContext';
import DropdownInteractionContext from 'struct/context/DropdownInteractionContext';
import ModalInteractionContext from 'struct/context/ModalInteractionContext';

export abstract class PanelPage implements CallbackHandler {
    
    private _client: Client;
    public buttonCallbacks: Map<string, (context: ButtonInteractionContext) => Promise<any>>;
    public dropdownCallbacks: Map<string, (context: DropdownInteractionContext) => Promise<any>>;
    public modalCallbacks: Map<string, (context: ModalInteractionContext) => Promise<any>>;

    public constructor(client: Client) {
        this._client = client;
        this.buttonCallbacks = new Map();
        this.dropdownCallbacks = new Map();
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

    public async onSelect(context: PanelDropdownInteractionContext, data: ComponentInteractionDataModel) {
        this.dropdownCallbacks.get(data.componentId)?.apply(this, [context]);
    }

    get client() {
        return this._client;
    }
}
