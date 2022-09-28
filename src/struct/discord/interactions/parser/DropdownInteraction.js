"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropdownInteraction = void 0;
const AplikoError_1 = require("../../../error/AplikoError");
const RepliableInteraction_1 = require("./RepliableInteraction");
class DropdownInteraction extends RepliableInteraction_1.RepliableInteraction {
    constructor(client, data) {
        super(client, data);
        this.customId = data.data.custom_id;
        this.values = data.data.values;
    }
    getCustomId() {
        return this.customId;
    }
    getValue(index) {
        if (index > this.values.length - 1)
            throw new AplikoError_1.AplikoError(`Trying to fetch value at index ${index} but values only has ${this.values.length} entries`);
        return this.values[index];
    }
    getValues() {
        return this.values;
    }
}
exports.DropdownInteraction = DropdownInteraction;
