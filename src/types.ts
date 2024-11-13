export type StringifyType =
	| 'bigint'
	| 'boolean'
	| 'Date'
	| 'function'
	| 'null'
	| 'number'
	| 'string'
	| 'symbol'
	| 'undefined';

export type DateFormat = 'iso' | 'number';

export interface TypedValue<T extends string> {
	t: T;
	v?: string;
}

export interface BaseOptions {
	bigintRadix: number;
	dateFormat: DateFormat;
	ignoreFunctions: boolean;
	skipNull: boolean;
	skipUndefined: boolean;
}

export type CustomStringifyOptions = BaseOptions;

export type CustomStringifyResult<T extends string> = { useResult: boolean; result?: TypedValue<T> };

export type CustomStringify<T extends string> = (
	obj: unknown,
	options: CustomStringifyOptions,
) => CustomStringifyResult<T>;

export interface DecentOptions<T extends string> extends BaseOptions {
	customStringify?: CustomStringify<T>;
}

export interface StringifyOptions<T extends string> extends Partial<BaseOptions> {
	customStringify?: CustomStringify<T>;
}

export type ConvertTypeOptions = BaseOptions;

export type CustomParseResult = { useResult: boolean; result?: unknown };

export type CustomParse<T extends string> = (obj: TypedValue<T>) => CustomParseResult;

export interface ParseOptions<T extends string> {
	customParse?: CustomParse<T>;
}
