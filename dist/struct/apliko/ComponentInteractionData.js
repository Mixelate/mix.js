"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchComponentInteractionData = exports.CreateComponentInteractionData = exports.GenerateComponentInteractionDataId = exports.ComponentInteractionData = void 0;
const crypto_1 = __importDefault(require("crypto"));
const DataStore_1 = require("../../util/data/DataStore");
exports.ComponentInteractionData = (0, DataStore_1.CreateNewDataStore)('interaction_data');
const GenerateComponentInteractionDataId = async () => {
    const randomId = crypto_1.default.randomBytes(16).toString('hex');
    const exists = await (0, DataStore_1.FindInDataStore)(exports.ComponentInteractionData, {
        id: randomId
    }).catch((_) => null);
    if (exists)
        return (0, exports.GenerateComponentInteractionDataId)();
    return randomId;
};
exports.GenerateComponentInteractionDataId = GenerateComponentInteractionDataId;
const CreateComponentInteractionData = async (input) => {
    const id = await (0, exports.GenerateComponentInteractionDataId)();
    await (0, DataStore_1.InsertIntoDataStore)(exports.ComponentInteractionData, {
        id,
        componentId: input.componentId,
        data: input.data,
        delete: false
    });
    return `apliko:${id}`;
};
exports.CreateComponentInteractionData = CreateComponentInteractionData;
const FetchComponentInteractionData = async (id) => {
    if (!id.startsWith('apliko:'))
        return {
            id: '',
            componentId: id,
            data: [],
            delete: false
        };
    const componentInteractionData = await (0, DataStore_1.FindInDataStore)(exports.ComponentInteractionData, { id: id.replace('apliko:', '') });
    if (!componentInteractionData)
        Promise.reject();
    return componentInteractionData;
};
exports.FetchComponentInteractionData = FetchComponentInteractionData;
