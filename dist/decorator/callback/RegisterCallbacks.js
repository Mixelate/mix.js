"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterCallbacks = void 0;
const DecoratorSymbols_1 = require("../DecoratorSymbols");
function RegisterCallbacks(Class) {
    return class extends Class {
        constructor(...args) {
            super(...args);
            const loadCallbacks = Class.prototype[DecoratorSymbols_1.LoadCallbacks];
            const stopCallbacks = Class.prototype[DecoratorSymbols_1.StopCallbacks];
            const buttonCallbacks = Class.prototype[DecoratorSymbols_1.ButtonCallbacks];
            const selectCallbacks = Class.prototype[DecoratorSymbols_1.SelectCallbacks];
            const messageCallbacks = Class.prototype[DecoratorSymbols_1.MessageCallbacks];
            const modalCallbacks = Class.prototype[DecoratorSymbols_1.ModalCallbacks];
            if (this.loadCallbacks && loadCallbacks)
                for (const callback of loadCallbacks)
                    this.loadCallbacks.push(callback);
            if (this.stopCallbacks && stopCallbacks)
                for (const callback of stopCallbacks)
                    this.stopCallbacks.push(callback);
            if (this.buttonCallbacks && buttonCallbacks)
                for (const [customId, callback] of buttonCallbacks)
                    this.buttonCallbacks.set(customId, callback);
            if (this.selectCallbacks && selectCallbacks)
                for (const [customId, callback] of selectCallbacks)
                    this.selectCallbacks.set(customId, callback);
            if (this.messageCallbacks && messageCallbacks)
                for (const callback of messageCallbacks)
                    this.messageCallbacks.push(callback);
            if (this.modalCallbacks && modalCallbacks)
                for (const [customId, callback] of modalCallbacks)
                    this.modalCallbacks.set(customId, callback);
        }
    };
}
exports.RegisterCallbacks = RegisterCallbacks;
