import DataStore from 'nedb';
export declare const CreateNewDataStore: <T>(name: string) => DataStore<T>;
export declare const InsertIntoDataStore: <T>(dataStore: DataStore<T>, data: T) => Promise<T>;
export declare const FindInDataStore: <T>(dataStore: DataStore<T>, query: any) => Promise<T>;
export declare const DeleteFromDataStore: <T>(dataStore: DataStore<T>, query: any) => Promise<void>;
