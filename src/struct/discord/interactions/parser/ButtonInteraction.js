"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonInteraction = void 0;
const RepliableInteraction_1 = require("./RepliableInteraction");
class ButtonInteraction extends RepliableInteraction_1.RepliableInteraction {
    constructor(client, data) {
        super(client, data);
        this.customId = data.data.custom_id;
    }
    getCustomId() {
        return this.customId;
    }
}
exports.ButtonInteraction = ButtonInteraction;
