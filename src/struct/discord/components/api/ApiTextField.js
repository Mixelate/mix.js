"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsApiTextField = void 0;
const ComponentType_1 = require("../enum/ComponentType");
function IsApiTextField(component) {
    return component.type == ComponentType_1.ComponentType.TEXT_FIELD;
}
exports.IsApiTextField = IsApiTextField;
