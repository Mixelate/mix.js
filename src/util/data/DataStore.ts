import DataStore from 'nedb';
import { defer } from '../Defer';

export const CreateNewDataStore = <T>(name: string): DataStore<T> => {
    const dataStore = new DataStore<T>({
        autoload: true,
        filename: `database/${name}.db`
    });

    dataStore.persistence.setAutocompactionInterval(3600000); // Auto compact every hour
    return dataStore;
};

export const InsertIntoDataStore = async <T>(dataStore: DataStore<T>, data: T): Promise<T> => {
    const deferred = defer<T>();

    dataStore.insert(data, (err, doc) => {
        if (err || !doc) return deferred.reject!('Error inserting into data store');
        return deferred.resolve!(doc);
    });

    return deferred.promise!;
};

export const FindInDataStore = async <T>(dataStore: DataStore<T>, query: any): Promise<T> => {
    const deferred = defer<T>();

    dataStore.findOne(query, (err, doc) => {
        if (err || !doc) return deferred.reject!('Error finding in data store');
        return deferred.resolve!(doc);
    });

    return deferred.promise!;
};

export const DeleteFromDataStore = async <T>(dataStore: DataStore<T>, query: any): Promise<void> => {
    const deferred = defer<void>();

    dataStore.remove(query, (err) => {
        if (err) return deferred.reject!('Error deleting from data store');
        return deferred.resolve!();
    });

    return deferred.promise!;
};
