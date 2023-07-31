import { CustomStringify, StringifyType } from './types';
export declare const stringify: <T = unknown, U extends string = StringifyType>(obj: T, options?: {
    customStringify?: CustomStringify<U> | undefined;
    ignoreDataLoss?: boolean | undefined;
} | undefined) => string;
