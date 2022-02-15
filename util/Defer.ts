export interface Deferred<T> {
  promise?: Promise<T>;
  resolve?: Function;
  reject?: Function;
}

export const defer = <T>() => {
  let deferred: Deferred<T> = {};

  deferred.promise = new Promise<T>((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred;
};
