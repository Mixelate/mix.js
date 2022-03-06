import { Collection } from 'discord.js';

export function $falsyThrow<T>(message: string, value: T): NonNullable<T> {
    if (value == null || value == undefined || (typeof value == 'number' && value == NaN)) throw message;
    return value!;
}

export function $falsyThrowParseI(message: string, value: string): number {
    const parsed = parseInt(value);

    if (parsed == NaN) throw message;

    return parsed;
}

export function $falsyThrowParseF(message: string, value: string): number {
    const parsed = parseFloat(value);

    if (parsed == NaN) throw message;

    return parsed;
}

export function $falsyDefaultParseI(value: string, defaultValue: number): number {
    const parsed = parseInt(value);

    if (parsed == NaN) return defaultValue;

    return parsed;
}

// /**
//  * Normal forEach loops call the asynchronous function with each item in the array at the same time
//  * and continues execution when all of them finish. { @link $forEachAsync } calls the asynchronous function
//  * on all of the items in the array synchronously so you can choose when to use async/await
//  *
//  * @param array The array you want to loop through
//  * @param callback The function you want to call with each item in the array
//  */
// export async function $iterateAsync<T>(this: any, array: Array<T>, callback: (value: T) => Promise<any>) {
//   for (const value of $unwrapPromise(array)) {
//     try {
//       await callback.call(this, $unwrapPromise(value));
//     } catch (err) {
//       if (err === BreakIteration)
//         return;
//       if (err === ContinueIteration)
//         continue;
//       throw err;
//     }
//   }
// }

// export async function $iterateCollectionAsync<T, A>(this: any, collection: Collection<T, A>, callback: (value: A, key: T) => Promise<any>) {
//   for (const [key, value] of $unwrapPromise(collection)) {
//     try {
//       await callback.call(this, $unwrapPromise(value), $unwrapPromise(key));
//     } catch (err) {
//       if (err === BreakIteration)
//         return;
//       if (err === ContinueIteration)
//         continue;
//       throw err;
//     }
//   }
// }

// export async function $mapCollection<T, A, B>(this: any, collection: Collection<T, A>, callback: (value: A, key: T) => Promise<B>): Promise<B[]> {
//   const mapped: B[] = [];

//   for (const [key, value] of $unwrapPromise(collection)) {
//     try {
//       mapped.push(await callback.call(this, $unwrapPromise(value), $unwrapPromise(key)));
//     } catch (err) {
//       if (err === BreakIteration)
//         return mapped;
//       if (err === ContinueIteration)
//         continue;
//       throw err;
//     }
//   }

//   return mapped;
// }

// export async function $macroBlock(this: any, block: () => any) {
//   await block.call(this).catch(err => {
//     if (err == ReturnBlock)
//       return; /* Silent catch since it will be a return */

//     throw err;
//   })
// }

// export async function $falsyBreak<T>(this: any, value: T) {
//   if (
//     value == null ||
//     value == undefined ||
//     (typeof value == "number" && value == NaN)
//   )
//     throw BreakIteration;
// }

// export async function $falsyContinue<T>(this: any, value: T): Promise<NonNullable<T>> {
//   if (
//     value == null ||
//     value == undefined ||
//     (typeof value == "number" && value == NaN) ||
//     (value instanceof Array && value.length == 0)
//   )
//     throw ContinueIteration;

//   return $unwrapPromise!(value)!;
// }

// /**
//  * Checks if a value (any) is falsy and throws ReturnBlock if it is.
//  * Automatically awaits any object containing .then so manually using async/await is no longer necessary
//  *
//  * @param value The value you're checking
//  * @returns The unwrapped value
//  */
// export async function $falsyReturn<T>(this: any, value: T): Promise<NonNullable<T>> {
//   if (
//     value == null ||
//     value == undefined ||
//     (typeof value == "number" && value == NaN)
//   )
//     throw ReturnBlock;

//   return $unwrapPromise!(value)!;
// }

// export async function $falsyReturnLog<T>(this: any, value: T, message: string): Promise<NonNullable<T>> {
//   try {
//     return await $falsyReturn!(value)
//   } catch (err) {
//     console.log(message)

//     if (err === ReturnBlock)
//       throw ReturnBlock;

//     throw err;
//   }
// }

// export async function $unwrapPromise<T>(this: any, value: T): T {
//   if ('then' in value) {
//     return await value;
//   }

//   return value;
// }

export const BreakIteration = new Error('Break in iteration');
export const ContinueIteration = new Error('Continue in iteration');
export const ReturnBlock = new Error('Break in block');
