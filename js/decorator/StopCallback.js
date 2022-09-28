"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StopCallback = void 0;
const DecoratorSymbols_1 = require("./DecoratorSymbols");
const StopCallback = (target, _, descriptor) => {
    target[DecoratorSymbols_1.StopCallbacks] = target[DecoratorSymbols_1.StopCallbacks] || new Array();
    target[DecoratorSymbols_1.StopCallbacks].push(descriptor.value);
};
exports.StopCallback = StopCallback;
