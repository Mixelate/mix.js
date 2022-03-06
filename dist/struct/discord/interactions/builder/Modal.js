"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modal = void 0;
const ValidationError_1 = require("../../../error/ValidationError");
const __1 = require("../../../..");
class Modal {
    constructor() {
        this._id = '';
        this._title = '';
        this._components = [];
    }
    static new() {
        return new Modal();
    }
    id(value) {
        this._id = value;
        return this;
    }
    title(value) {
        this._title = value;
        return this;
    }
    components(...components) {
        this._components.push(...components.filter((component) => component != undefined));
        return this;
    }
    toJSON() {
        if (!this._id)
            throw new ValidationError_1.ValidationError('Failed to validate modal interaction response: Falsy modal ID');
        if (!this._title)
            throw new ValidationError_1.ValidationError('Failed to validate modal interaction response: Falsy modal title');
        if (this._components.length == 0)
            throw new ValidationError_1.ValidationError('Failed to validate modal interaction response: No components provided');
        return {
            custom_id: this._id,
            title: this._title,
            //TODO: Restructure components to make this bit more typesafe
            components: this._components.map((component) => __1.ActionRow.new().components(component).toJSON())
        };
    }
}
exports.Modal = Modal;
