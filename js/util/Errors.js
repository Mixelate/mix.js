"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SilentCatch = exports.ThrowString = exports.ThrowError = exports.PassThrowError = void 0;
function PassThrowError(error, appended) {
    if (!(error instanceof Error))
        throw error;
    error.message = `${appended}, ${error.message}`;
    throw error;
}
exports.PassThrowError = PassThrowError;
function ThrowError(error) {
    throw new Error(error);
}
exports.ThrowError = ThrowError;
function ThrowString(error) {
    throw error;
}
exports.ThrowString = ThrowString;
async function SilentCatch(fun, thisObj, ...args) {
    try {
        await fun.apply(thisObj, args);
        return true;
    }
    catch (_) {
        return false;
    }
}
exports.SilentCatch = SilentCatch;
