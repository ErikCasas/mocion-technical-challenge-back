export const notEmpty = (a: string): a is string => a.length > 0;
export const notUndefined = <T>(a: T | undefined): a is T => a !== undefined;
export const notError = <T>(a: T | Error): a is T => !(a instanceof Error);
export const notNull = <T>(a: T | null): a is T => a !== null;
