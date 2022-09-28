"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadCallback = void 0;
const DecoratorSymbols_1 = require("./DecoratorSymbols");
const LoadCallback = (target, _, descriptor) => {
    target[DecoratorSymbols_1.LoadCallbacks] = target[DecoratorSymbols_1.LoadCallbacks] || new Array();
    target[DecoratorSymbols_1.LoadCallbacks].push(descriptor.value);
};
exports.LoadCallback = LoadCallback;
