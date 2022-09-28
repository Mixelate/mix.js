"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageCallback = void 0;
const DecoratorSymbols_1 = require("./DecoratorSymbols");
const MessageCallback = (target, _, descriptor) => {
    target[DecoratorSymbols_1.MessageCallbacks] = target[DecoratorSymbols_1.MessageCallbacks] || new Array();
    target[DecoratorSymbols_1.MessageCallbacks].push(descriptor.value);
};
exports.MessageCallback = MessageCallback;
