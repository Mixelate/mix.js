"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
class Component {
    constructor(type) {
        this.data = {
            type
        };
    }
    toJSON() {
        return this.data;
    }
}
exports.Component = Component;
