"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropdownCallback = void 0;
const DecoratorSymbols_1 = require("./DecoratorSymbols");
const DropdownCallback = (customId = DecoratorSymbols_1.CALLBACK_WILDCARD) => (target, _, descriptor) => {
    target[DecoratorSymbols_1.SelectCallbacks] = target[DecoratorSymbols_1.SelectCallbacks] || new Map();
    target[DecoratorSymbols_1.SelectCallbacks].set(customId, descriptor.value);
};
exports.DropdownCallback = DropdownCallback;
