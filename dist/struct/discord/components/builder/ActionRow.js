"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionRow = void 0;
const ComponentType_1 = require("../enum/ComponentType");
const Component_1 = require("./Component");
class ActionRow extends Component_1.Component {
    constructor() {
        super(ComponentType_1.ComponentType.ACTION_ROW);
    }
    static new(...components) {
        return new ActionRow().components(...components);
    }
    components(...components) {
        if (!this.data.components)
            this.data.components = [];
        this.data.components.push(...components.map((component) => component.toJSON()));
        return this;
    }
}
exports.ActionRow = ActionRow;
