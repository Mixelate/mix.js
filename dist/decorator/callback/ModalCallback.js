"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalCallback = void 0;
const DecoratorSymbols_1 = require("../DecoratorSymbols");
const ModalCallback = (customId = DecoratorSymbols_1.CALLBACK_WILDCARD) => (target, propertyKey, descriptor) => {
    target[DecoratorSymbols_1.ModalCallbacks] = target[DecoratorSymbols_1.ModalCallbacks] || new Map();
    target[DecoratorSymbols_1.ModalCallbacks].set(customId, descriptor.value);
};
exports.ModalCallback = ModalCallback;
