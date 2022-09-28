export declare function PassThrowError(error: any, appended: string): never;
export declare function ThrowError(error: any): never;
export declare function ThrowString(error: string): never;
export declare function SilentCatch(fun: (...args: any[]) => any, thisObj: any, ...args: any): Promise<boolean>;
