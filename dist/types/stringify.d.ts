import { StringifyOptions, StringifyType } from './types';
export declare const stringify: <T extends string = StringifyType>(obj: unknown, options?: StringifyOptions<T>) => string;
