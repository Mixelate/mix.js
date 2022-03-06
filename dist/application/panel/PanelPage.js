"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanelPage = void 0;
const AplikoEmbed_ts_1 = require("../../util/conversion/AplikoEmbed.ts");
class PanelPage {
    constructor(client) {
        this._client = client;
        this.buttonCallbacks = new Map();
        this.selectCallbacks = new Map();
        this.modalCallbacks = new Map();
    }
    async constructPage(context) {
        return {
            embeds: [
                {
                    style: AplikoEmbed_ts_1.AplikoEmbedStyle.ERROR,
                    description: 'Page not configured.'
                }
            ],
            components: []
        };
    }
    async onModal(context, data) {
        this.modalCallbacks.get(data.componentId)?.apply(this, [context]);
    }
    async onButton(context, data) {
        this.buttonCallbacks.get(data.componentId)?.apply(this, [context]);
    }
    async onSelect(context, data) {
        this.selectCallbacks.get(data.componentId)?.apply(this, [context]);
    }
    get client() {
        return this._client;
    }
}
exports.PanelPage = PanelPage;
