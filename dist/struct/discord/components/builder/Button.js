"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkButton = exports.InteractButton = exports.Button = void 0;
const ButtonStyle_1 = require("../enum/ButtonStyle");
const ComponentType_1 = require("../enum/ComponentType");
const Component_1 = require("./Component");
class Button extends Component_1.Component {
    constructor() {
        super(ComponentType_1.ComponentType.BUTTON);
    }
}
exports.Button = Button;
class InteractButton extends Button {
    constructor() {
        super();
    }
    static new(id) {
        return new InteractButton()
            .id(id || '')
            .style(ButtonStyle_1.ButtonStyle.SECONDARY)
            .label('\u200b');
    }
    label(value) {
        this.data.label = value;
        return this;
    }
    emoji(value) {
        this.data.emoji = value;
        return this;
    }
    disabled(value) {
        this.data.disabled = value;
        return this;
    }
    id(value) {
        this.data.custom_id = value;
        return this;
    }
    style(value) {
        this.data.style = value;
        return this;
    }
}
exports.InteractButton = InteractButton;
class LinkButton extends Button {
    constructor() {
        super();
        this.data.style = ButtonStyle_1.ButtonStyle.LINK;
    }
    static new() {
        return new LinkButton();
    }
    label(value) {
        this.data.label = value;
        return this;
    }
    emoji(value) {
        this.data.emoji = value;
        return this;
    }
    disabled(value) {
        this.data.disabled = value;
        return this;
    }
    url(value) {
        this.data.url = value;
        return this;
    }
}
exports.LinkButton = LinkButton;
