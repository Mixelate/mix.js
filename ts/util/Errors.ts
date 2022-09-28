export function PassThrowError(error: any, appended: string): never {
    if (!(error instanceof Error)) throw error;

    error.message = `${appended}, ${error.message}`;
    throw error;
}

export function ThrowError(error: any): never {
    throw new Error(error);
}

export function ThrowString(error: string): never {
    throw error;
}

export async function SilentCatch(fun: (...args: any[]) => any, thisObj: any, ...args: any): Promise<boolean> {
    try {
        await fun.apply(thisObj, args);
        return true;
    } catch (_) {
        return false;
    }
}
