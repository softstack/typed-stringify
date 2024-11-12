import { ParseOptions, TypedValue } from './types';
export declare const isTypedValue: (obj: unknown) => obj is TypedValue<import("./types").StringifyType>;
export declare const parse: (s: string, options?: ParseOptions) => unknown;
