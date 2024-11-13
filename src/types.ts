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

export interface TypedValue<T extends string = StringifyType> {
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

export type CustomStringify<T extends string> = (
	obj: unknown,
	options: CustomStringifyOptions,
) => { useResult: boolean; result?: TypedValue<T> };

export interface DecentOptions<T extends string> extends BaseOptions {
	customStringify?: CustomStringify<T>;
}

export interface StringifyOptions<T extends string> extends Partial<BaseOptions> {
	customStringify?: CustomStringify<T>;
}

export type ConvertTypeOptions = BaseOptions;

export type CustomParse = (obj: TypedValue) => { useResult: boolean; result?: unknown };

export interface ParseOptions {
	customParse?: CustomParse;
}
