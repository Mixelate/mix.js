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
export declare function $sftm<T>(message: string, value: T): NonNullable<T>;
/**
 * Throws an error message if the provided value is falsy
 *
 * @param value The value to check
 * @returns The value if it's not falsy or never if it is
 */
export declare function $sft<T>(value: T): NonNullable<T>;
/**
 * Resolved the provided promise (with a rejection returning null)
 * and throws the provided message if the resolved value is falsy
 *
 * @param message The message thrown
 * @param promise The promise to resolve
 * @returns The resolved value if it's not falsy or never if it is
 */
export declare function $ftm<T>(message: string, promise: Promise<T>, print?: boolean): Promise<NonNullable<Awaited<T>>>;
/**
 * Resolved the provided promise (with a rejection returning null)
 * and throws an error message if the resolved value is falsy
 *
 * @param promise The promise to resolve
 * @returns The resolved value if it's not falsy or never if it is
 */
export declare function $ft<T>(promise: Promise<T>, print?: boolean): Promise<NonNullable<Awaited<T>>>;
export declare function $ftmpi(message: string, value: string): number;
export declare function $ftpi(value: string): number;
export declare function $ftmpf(message: string, value: string): number;
export declare function $fdpi(value: string, defaultValue: number): number;
export declare function $if<T>(condition: boolean, value: T): T | undefined;
export declare const BreakIteration: Error;
export declare const ContinueIteration: Error;
export declare const ReturnBlock: Error;
