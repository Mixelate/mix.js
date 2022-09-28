export const GetParameterNames = (method: Function): string[] => {
    var fnStr = method.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm, '');
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
    if (result === null) result = [];
    return result;
};
