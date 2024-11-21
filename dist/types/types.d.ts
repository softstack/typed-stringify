export type StringifyType = 'bigint' | 'boolean' | 'Date' | 'Error' | 'function' | 'Map' | 'null' | 'number' | 'Set' | 'string' | 'symbol' | 'undefined';
export type DateFormat = 'iso' | 'number';
export interface TypedValue<T extends string> {
    t: T;
    v?: string;
}
export interface BaseStringifyOptions {
    bigintRadix: number;
    currentDepth: number;
    dateFormat: DateFormat;
    ignoreFunctions: boolean;
    maxDepth: number;
    skipNull: boolean;
    skipUndefined: boolean;
}
export interface CustomStringifyOptions<T extends string> extends BaseStringifyOptions {
    customStringify: CustomStringify<T>;
}
export type CustomStringifyResult<T extends string> = {
    useResult: boolean;
    result?: TypedValue<T>;
};
export type CustomStringify<T extends string> = (obj: unknown, options: CustomStringifyOptions<T>) => CustomStringifyResult<T>;
export interface DefaultedStringifyOptions<T extends string> extends BaseStringifyOptions {
    customStringify?: CustomStringify<T>;
}
export type StringifyOptions<T extends string> = Partial<DefaultedStringifyOptions<T>>;
export interface BaseParseOptions {
    currentDepth: number;
    maxDepth: number;
}
export interface CustomParseOptions<T extends string> extends BaseParseOptions {
    customParse: CustomParse<T>;
}
export type CustomParseResult = {
    useResult: boolean;
    result?: unknown;
};
export type CustomParse<T extends string> = (obj: TypedValue<T>, options: CustomParseOptions<T>) => CustomParseResult;
export interface DefaultedParseOptions<T extends string> extends BaseParseOptions {
    customParse?: CustomParse<T>;
}
export type ParseOptions<T extends string> = Partial<DefaultedParseOptions<T>>;
