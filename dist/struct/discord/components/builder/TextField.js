"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextField = void 0;
const __1 = require("../../../..");
const Component_1 = require("./Component");
class TextField extends Component_1.Component {
    constructor() {
        super(__1.ComponentType.TEXT_FIELD);
    }
    static new() {
        return new TextField();
    }
    customId(value) {
        this.data.custom_id = value;
        return this;
    }
    style(value) {
        this.data.style = value;
        return this;
    }
    title(value) {
        this.data.label = value;
        return this;
    }
    minimumLength(value) {
        this.data.min_length = value;
        return this;
    }
    maximumLength(value) {
        this.data.max_length = value;
        return this;
    }
    required(value) {
        this.data.required = value;
        return this;
    }
    defaultText(value) {
        this.data.value = value;
        return this;
    }
    placeholder(value) {
        this.data.placeholder = value;
        return this;
    }
}
exports.TextField = TextField;
