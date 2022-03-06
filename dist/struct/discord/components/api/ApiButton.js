"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsApiLinkButton = exports.IsApiInteractButton = exports.IsApiButton = void 0;
const ComponentType_1 = require("../enum/ComponentType");
function IsApiButton(component) {
    return component.type == ComponentType_1.ComponentType.BUTTON;
}
exports.IsApiButton = IsApiButton;
function IsApiInteractButton(buttonData) {
    return !('url' in buttonData);
}
exports.IsApiInteractButton = IsApiInteractButton;
function IsApiLinkButton(buttonData) {
    return 'url' in buttonData;
}
exports.IsApiLinkButton = IsApiLinkButton;
