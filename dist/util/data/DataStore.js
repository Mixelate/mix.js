"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteFromDataStore = exports.FindInDataStore = exports.InsertIntoDataStore = exports.CreateNewDataStore = void 0;
const nedb_1 = __importDefault(require("nedb"));
const Defer_1 = require("../Defer");
const CreateNewDataStore = (name) => {
    const dataStore = new nedb_1.default({
        autoload: true,
        filename: 'database/name' + '.db'
    });
    dataStore.persistence.setAutocompactionInterval(3600000); // Auto compact every hour
    return dataStore;
};
exports.CreateNewDataStore = CreateNewDataStore;
const InsertIntoDataStore = async (dataStore, data) => {
    const deferred = (0, Defer_1.defer)();
    dataStore.insert(data, (err, doc) => {
        if (err || !doc)
            return deferred.reject('Error inserting into data store');
        return deferred.resolve(doc);
    });
    return deferred.promise;
};
exports.InsertIntoDataStore = InsertIntoDataStore;
const FindInDataStore = async (dataStore, query) => {
    const deferred = (0, Defer_1.defer)();
    dataStore.findOne(query, (err, doc) => {
        if (err || !doc)
            return deferred.reject('Error finding in data store');
        return deferred.resolve(doc);
    });
    return deferred.promise;
};
exports.FindInDataStore = FindInDataStore;
const DeleteFromDataStore = async (dataStore, query) => {
    const deferred = (0, Defer_1.defer)();
    dataStore.remove(query, (err) => {
        if (err)
            return deferred.reject('Error deleting from data store');
        return deferred.resolve();
    });
    return deferred.promise;
};
exports.DeleteFromDataStore = DeleteFromDataStore;
