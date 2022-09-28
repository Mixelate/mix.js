"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CALLBACK_WILDCARD = exports.ModalCallbacks = exports.MessageCallbacks = exports.SelectCallbacks = exports.ButtonCallbacks = exports.StopCallbacks = exports.LoadCallbacks = void 0;
// Common symbols used by multiple application decorators
exports.LoadCallbacks = Symbol('___LoadCallbacks');
exports.StopCallbacks = Symbol('___StopCallbacks');
exports.ButtonCallbacks = Symbol('___ButtonCallbacks');
exports.SelectCallbacks = Symbol('___SelectCallbacks');
exports.MessageCallbacks = Symbol('___MessageCallbacks');
exports.ModalCallbacks = Symbol('___ModalCallbacks');
// Wildcard used for callbacks that usually require a filter
exports.CALLBACK_WILDCARD = '*';
