"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AplikoError = void 0;
class AplikoError extends Error {
    constructor(reason, possibleSolutions) {
        super();
        this.reason = reason;
        this.possibleSolutions = possibleSolutions;
    }
    toString() {
        return `\nApliko Error\n------------------------\n${this.stack?.replace('Error', 'Stacktrace')}\n------------------------\n${this.reason}\n${this.possibleSolutions
            ?.map((solution) => `  - ${solution}`)
            .join('\n')}\n`;
    }
}
exports.AplikoError = AplikoError;
