"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsApiMultiSelectDropdown = exports.IsApiDropdown = void 0;
const ComponentType_1 = require("../enum/ComponentType");
function IsApiDropdown(component) {
    return component.type == ComponentType_1.ComponentType.DROPDOWN;
}
exports.IsApiDropdown = IsApiDropdown;
function IsApiMultiSelectDropdown(dropdown) {
    return 'max_values' in dropdown;
}
exports.IsApiMultiSelectDropdown = IsApiMultiSelectDropdown;
