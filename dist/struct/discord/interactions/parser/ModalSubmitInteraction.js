"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalSubmitInteraction = void 0;
const RepliableInteraction_1 = require("./RepliableInteraction");
class ModalSubmitInteraction extends RepliableInteraction_1.RepliableInteraction {
    constructor(client, data) {
        super(client, data);
        this.customId = data.data.custom_id;
        this.values = new Map();
        data.data.components.forEach((actionRow) => {
            actionRow.components.forEach((textField) => {
                this.values.set(textField.custom_id, textField.value);
            });
        });
    }
    getCustomId() {
        return this.customId;
    }
    hasKey(key) {
        return this.values.has(key);
    }
    getValue(key) {
        return this.values.get(key);
    }
    getValues() {
        return this.values;
    }
}
exports.ModalSubmitInteraction = ModalSubmitInteraction;
