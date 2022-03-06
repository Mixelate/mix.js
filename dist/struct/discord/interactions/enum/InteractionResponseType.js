"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionResponseType = void 0;
var InteractionResponseType;
(function (InteractionResponseType) {
    InteractionResponseType[InteractionResponseType["PONG"] = 1] = "PONG";
    InteractionResponseType[InteractionResponseType["MESSAGE"] = 4] = "MESSAGE";
    InteractionResponseType[InteractionResponseType["DEFERRED_MESSAGE"] = 5] = "DEFERRED_MESSAGE";
    InteractionResponseType[InteractionResponseType["DEFERRED_UPDATE"] = 6] = "DEFERRED_UPDATE";
    InteractionResponseType[InteractionResponseType["UPDATE"] = 7] = "UPDATE";
    InteractionResponseType[InteractionResponseType["COMMAND_AUTOCOMPLETE"] = 8] = "COMMAND_AUTOCOMPLETE";
    InteractionResponseType[InteractionResponseType["MODAL"] = 9] = "MODAL";
})(InteractionResponseType = exports.InteractionResponseType || (exports.InteractionResponseType = {}));
