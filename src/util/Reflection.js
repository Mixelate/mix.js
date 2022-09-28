"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetParameterNames = void 0;
const GetParameterNames = (method) => {
    var fnStr = method.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm, '');
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
    if (result === null)
        result = [];
    return result;
};
exports.GetParameterNames = GetParameterNames;
