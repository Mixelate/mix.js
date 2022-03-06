"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonCallback = void 0;
const DecoratorSymbols_1 = require("../DecoratorSymbols");
const ButtonCallback = (customId = DecoratorSymbols_1.CALLBACK_WILDCARD) => (target, propertyKey, descriptor) => {
    target[DecoratorSymbols_1.ButtonCallbacks] = target[DecoratorSymbols_1.ButtonCallbacks] || new Map();
    target[DecoratorSymbols_1.ButtonCallbacks].set(customId, descriptor.value);
};
exports.ButtonCallback = ButtonCallback;
