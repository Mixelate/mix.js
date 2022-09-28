export declare class AplikoError extends Error {
    reason: string;
    possibleSolutions?: string[] | undefined;
    constructor(reason: string, possibleSolutions?: string[] | undefined);
    toString(): string;
}
