/**
 * Useful macros for quickly executing conditionals on variables and acting based on the result
 * 
 * @author antja03
 */

/**
 * Throws the provided message if the provided value is falsy
 * 
 * @param message The message thrown
 * @param value The value to check
 * @returns The value if it's not falsy or never if it is
 */
 export function $sftm<T>(message: string, value: T): NonNullable<T> {
    if (value == null || value == undefined || (typeof value == 'number' && isNaN(value)))
        throw message;

    return value!;
}

/**
 * Throws an error message if the provided value is falsy
 * 
 * @param value The value to check
 * @returns The value if it's not falsy or never if it is
 */
 export function $sft<T>(value: T): NonNullable<T> {
    return $sftm('An error occurred.', value);
}

/**
 * Resolved the provided promise (with a rejection returning null) 
 * and throws the provided message if the resolved value is falsy
 * 
 * @param message The message thrown
 * @param promise The promise to resolve
 * @returns The resolved value if it's not falsy or never if it is
 */
export async function $ftm<T>(message: string, promise: Promise<T>, print?: boolean) {
    const resolved = await promise.catch(_ => {
        if (print)
            console.log(_);
        return null;
    });

    if (resolved == null || resolved == undefined || (typeof resolved === 'number' && isNaN(resolved)))
        throw message;

    return resolved!;
}

/**
 * Resolved the provided promise (with a rejection returning null) 
 * and throws an error message if the resolved value is falsy
 * 
 * @param promise The promise to resolve
 * @returns The resolved value if it's not falsy or never if it is
 */
 export async function $ft<T>(promise: Promise<T>, print?: boolean) {
    return $ftm('An error occurred.', promise, print);
}

export function $ftmpi(message: string, value: string): number {
    const parsed = parseInt(value);

    if (isNaN(parsed)) throw message;

    return parsed;
}

export function $ftpi(value: string): number {
    return $ftmpi!('An error occurred.', value)
}

export function $ftmpf(message: string, value: string): number {
    const parsed = parseFloat(value);

    if (parsed == NaN) throw message;

    return parsed;
}

export function $fdpi(value: string, defaultValue: number): number {
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
