export interface Deferred<T> {
    promise?: Promise<T>;
    resolve?: Function;
    reject?: Function;
}
export declare const defer: <T>() => Deferred<T>;
