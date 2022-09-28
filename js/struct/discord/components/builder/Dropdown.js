"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiSelectDropdown = exports.SingleSelectDropdown = exports.Dropdown = exports.DropdownOption = void 0;
const ApiDropdown_1 = require("../api/ApiDropdown");
const __1 = require("../../../..");
const Component_1 = require("./Component");
class DropdownOption {
    constructor() {
        this.data = {
            label: ''
        };
    }
    static new(value) {
        return new DropdownOption().value(value || '');
    }
    label(value) {
        this.data.label = value;
        return this;
    }
    value(value) {
        this.data.value = value;
        return this;
    }
    description(value) {
        this.data.description = value;
        return this;
    }
    emoji(value) {
        this.data.emoji = value;
        return this;
    }
    default(value) {
        this.data.default = value;
        return this;
    }
    toJSON() {
        // TODO: Validator
        if (!this.data.value)
            this.data.value = this.data.label;
        return this.data;
    }
}
exports.DropdownOption = DropdownOption;
class Dropdown extends Component_1.Component {
    constructor() {
        super(__1.ComponentType.DROPDOWN);
    }
    customId(value) {
        this.data.custom_id = value;
        return this;
    }
    options(...options) {
        if (!this.data.options)
            this.data.options = [];
        this.data.options.push(...options.filter((option) => option != undefined).map((option) => option.toJSON()));
        return this;
    }
    placeholder(value) {
        this.data.placeholder = value;
        return this;
    }
    disabled(value) {
        this.data.disabled = value;
        return this;
    }
    toJSON() {
        //TODO: Validator
        if ((0, ApiDropdown_1.IsApiMultiSelectDropdown)(this.data))
            if (this.data.max_values == 'MAX')
                this.data.max_values = this.data.options.length;
        return this.data;
    }
}
exports.Dropdown = Dropdown;
class SingleSelectDropdown extends Dropdown {
    static new(id) {
        return new SingleSelectDropdown().customId(id || '');
    }
}
exports.SingleSelectDropdown = SingleSelectDropdown;
class MultiSelectDropdown extends Dropdown {
    constructor() {
        super();
        this.data.max_values = 'MAX';
    }
    static new() {
        return new MultiSelectDropdown();
    }
    minimumSelections(value) {
        this.data.min_values = value;
        return this;
    }
    maximumSelections(value) {
        this.data.max_values = value;
        return this;
    }
}
exports.MultiSelectDropdown = MultiSelectDropdown;
